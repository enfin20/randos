<script>
  import { onMount, onDestroy } from "svelte";
  import { getDetail } from "$lib/detail";
  export let detail;
  let weatherIcon = ["Snow", "Rain", "Fog", "Wind", "Thunder", "Cloud", "SemiSun", "Sun"];
  let difficultyIcon = ["ZeroDay", "Star", "Star", "Star"];
  let starIcon = ["Ugly", "Soso", "Star", "Star", "Star"];
  let moodIcon = ["Sad", "Neutral", "Happy"];
  let mapElement;
  let map;
  let roadbook = [];
  let parcours = [];
  let randos = [];
  let currentRando = "";

  onMount(async () => {
    let res = await fetch("/MDB/randos");
    const ran = await res.json();
    randos = await ran.randos;
    // detail = getDetail(window.location.href);
    currentRando = randos[0].rando;

    loadTables();
  });

  onDestroy(async () => {
    if (map) {
      console.log("Unloading Leaflet map.");
      map.remove();
    }
  });

  export async function loadTables() {
    console.info("detail 2", detail);
    if (map) {
      console.log("Unloading Leaflet map.");
      map.remove();
    }

    var customOptions = {
      minWidth: "250",
      autoPanPadding: [50, 50],
      keepInView: true,
    };
    let diffIcons = "";
    let landscapeIcons = "";
    let popupText = [];
    let latlngs = [];
    let debutParcours = 100000000;
    let finParcours = 0;
    let currentDay = 1;
    console.info("currentRando", currentRando);
    let res = await fetch("/MDB/roadbook?sort=1&map=ok&rando=" + currentRando);
    const roa = await res.json();
    roadbook = await roa.roadbook;
    console.info("roadbook", roadbook);
    for (var i = 0; i < roadbook.length; i++) {
      if (roadbook[i].dayCounter <= debutParcours) {
        debutParcours = roadbook[i].dayCounter;
      }
      if (roadbook[i].dayCounter >= finParcours) {
        finParcours = roadbook[i].dayCounter;
      }
      // gestion des zero days sans balise
      // on affecte la balise du jour précédent de fin de parcours
      if (Number(roadbook[i].finParcoursLat) + Number(roadbook[i].finParcoursLng) === 0) {
        for (var j = i - 1; j >= 0; j--) {
          if (Number(roadbook[j].finParcoursLat) + Number(roadbook[j].finParcoursLng) != 0) {
            roadbook[i].debutParcoursLat = Number(roadbook[j].finParcoursLat);
            roadbook[i].debutParcoursLng = Number(roadbook[j].finParcoursLng);
            roadbook[i].finParcoursLat = Number(roadbook[j].finParcoursLat);
            roadbook[i].finParcoursLng = Number(roadbook[j].finParcoursLng);
            j = -1;
          }
        }
      }
    }

    res = await fetch(
      "/MDB/parcours?debutParcours=" + debutParcours + "&finParcours=" + finParcours + "&rando=" + currentRando,
    );
    const par = await res.json();
    parcours = await par.parcours;
    let parcoursColor = "DodgerBlue";
    console.info("parcours", parcours.length);
    if (typeof window != "undefined") {
      const leaflet = await import("leaflet");

      var starsIcon = new leaflet.Icon({
        iconUrl: "/images/starred.png",
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        popupAnchor: [0, -32],
      });
      var bivouacIcon = new leaflet.Icon({
        iconUrl: "/images/free_tent.png",
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        popupAnchor: [0, -32],
      });
      var campIcon = new leaflet.Icon({
        iconUrl: "/images/camping_tent.png",
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        popupAnchor: [0, -32],
      });
      var hotelIcon = new leaflet.Icon({
        iconUrl: "/images/map_hotel.png",
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        popupAnchor: [0, -32],
      });
      var freeIcon = new leaflet.Icon({
        iconUrl: "/images/home.png",
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        popupAnchor: [0, -32],
      });
      var reposIcon = new leaflet.Icon({
        iconUrl: "/images/bed.png",
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        popupAnchor: [0, -32],
      });

      var typeIcons = [starsIcon, bivouacIcon, campIcon, hotelIcon, freeIcon, reposIcon];
      let iconIndex = 0;
      let tempPopupText = "";
      let tempPopupTextId = -1;

      map = leaflet
        .map(mapElement)
        .setView(
          [
            Number(roadbook[0].debutParcoursLat) +
              (Number(roadbook[roadbook.length - 1].finParcoursLat) - Number(roadbook[0].debutParcoursLat)) / 2,
            Number(roadbook[0].debutParcoursLng) +
              (Number(roadbook[roadbook.length - 1].finParcoursLng) - Number(roadbook[0].debutParcoursLng)) / 2,
          ],
          14,
        );

      for (var i = 0; i < parcours.length; i++) {
        if (parcours[i].type === undefined) {
          parcours[i].color = "DodgerBlue";
        } else {
          switch (parcours[i].type) {
            case "Pied":
              parcours[i].color = "DodgerBlue";
              break;
            case "Train":
              parcours[i].color = "Crimson";
              break;
            case "Stop":
              parcours[i].color = "Chartreuse";
              break;
            case "Bus":
              parcours[i].color = "DeepPink";
              break;
            default:
              parcours[i].color = "black";
          }
        }
        // tracé des lignes jour par jour, type par type
        if (parcours[i].dayCounter === currentDay) {
          if (parcours[i].color === parcoursColor && !parcours[i].rupture) {
            latlngs.push([parcours[i].lat, parcours[i].lng]);
          } else {
            leaflet.polyline(latlngs, { color: parcoursColor }).addTo(map);
            // on réinitialise le parcours
            latlngs = [];
            parcoursColor = parcours[i].color;
          }
        } else {
          // nouveau jour, on trace le parcours du jour précédent
          // on ajoute la fin d'étape
          leaflet.polyline(latlngs, { color: parcoursColor }).addTo(map);
          // on réinitialise le parcours
          latlngs = [];
          parcoursColor = parcours[i].color;

          currentDay++;
        }
      }
      // dernier élément
      leaflet.polyline(latlngs, { color: parcours[parcours.length - 1].color }).addTo(map);
      //'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
      leaflet
        .tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
          minZoom: 0,
          maxZoom: 20,
          attribution:
            'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
          ext: "png",
        })
        .addTo(map);
      var markers = [];

      markers.push(
        leaflet
          .marker([Number(roadbook[0].debutParcoursLat), Number(roadbook[0].debutParcoursLng)], {
            icon: typeIcons[iconIndex],
          })
          .bindTooltip("0", {
            permanent: true,
            direction: "right",
          }),
      );

      for (var i = 0; i < roadbook.length; i++) {
        diffIcons = "";
        for (var j = 0; j < difficultyIcon.length; j++) {
          if (j === 0) {
            if (roadbook[i].difficulty === 0) {
              diffIcons = "<img src='/images/" + difficultyIcon[0] + ".png' class='w-[30px] inline' />";
            } else {
              diffIcons = "<img src='/images/" + difficultyIcon[0] + "_in.png' class='w-[30px] inline' />";
            }
          } else {
            if (roadbook[i].difficulty >= j) {
              diffIcons += "<img src='/images/" + difficultyIcon[j] + ".png' class='w-[30px] inline' />";
            } else {
              diffIcons += "<img src='/images/" + difficultyIcon[j] + "_in.png' class='w-[30px] inline' />";
            }
          }
        }
        landscapeIcons = "";
        for (var j = 0; j < starIcon.length; j++) {
          if (j === 0) {
            if (roadbook[i].landscape === 0) {
              landscapeIcons = "<img src='/images/" + starIcon[0] + ".png' class='w-[30px] inline' />";
            } else {
              landscapeIcons = "<img src='/images/" + starIcon[0] + "_in.png' class='w-[30px] inline' />";
            }
          }
          if (j === 1) {
            if (roadbook[i].landscape === 1) {
              landscapeIcons += "<img src='/images/" + starIcon[1] + ".png' class='w-[30px] inline' />";
            } else {
              landscapeIcons += "<img src='/images/" + starIcon[1] + "_in.png' class='w-[30px] inline' />";
            }
          }
          if (j >= 2) {
            if (roadbook[i].landscape >= j) {
              landscapeIcons += "<img src='/images/" + starIcon[j] + ".png' class='w-[30px] inline' />";
            } else {
              landscapeIcons += "<img src='/images/" + starIcon[j] + "_in.png' class='w-[30px] inline' />";
            }
          }
        }
        // text pour l'affichage
        if (detail) {
          popupText.push(
            "<p><b>Jour " +
              roadbook[i].dayCounter +
              " : " +
              roadbook[i].start +
              " / " +
              roadbook[i].end +
              "</b></p><p><img src='/images/" +
              moodIcon[roadbook[i].mood] +
              ".png' class='w-[25px] md:w-[30px] inline' />&nbsp;" +
              "<img src='/images/" +
              weatherIcon[roadbook[i].weather] +
              ".png' class='w-[25px] md:w-[30px] inline' />&nbsp;&nbsp;&nbsp;" +
              roadbook[i].dist +
              " kms " +
              roadbook[i].elePos +
              " / " +
              roadbook[i].eleNeg +
              " m<br/>" +
              diffIcons +
              "<br/>" +
              landscapeIcons +
              "</p><p>" +
              roadbook[i].summary +
              "</p><p>" +
              roadbook[i].detail +
              "</p><p>Cumul : " +
              Number(Math.round(roadbook[i].distCumul)).toLocaleString("fr") +
              " kms " +
              Number(roadbook[i].elePosCumul).toLocaleString("fr") +
              " / " +
              Number(roadbook[i].eleNegCumul).toLocaleString("fr") +
              " m</p>",
          );
        } else {
          popupText.push(
            "<p><b>Jour " +
              roadbook[i].dayCounter +
              " : " +
              roadbook[i].start +
              " / " +
              roadbook[i].end +
              "<img src='/images/" +
              weatherIcon[roadbook[i].weather] +
              ".png' class='w-[25px] md:w-[30px] inline' />&nbsp;&nbsp;&nbsp;" +
              roadbook[i].dist +
              " kms " +
              roadbook[i].elePos +
              " / " +
              roadbook[i].eleNeg +
              " m<br/>" +
              diffIcons +
              "<br/>" +
              landscapeIcons +
              "</p><p>" +
              roadbook[i].summary +
              "</p><p>" +
              "</p><p>Cumul : " +
              Number(Math.round(roadbook[i].distCumul)).toLocaleString("fr") +
              " kms " +
              Number(roadbook[i].elePosCumul).toLocaleString("fr") +
              " / " +
              Number(roadbook[i].eleNegCumul).toLocaleString("fr") +
              " m</p>",
          );
        }

        // on détermine si il s'agit d'un zero day
        if (roadbook[i].difficulty > 0) {
          if (roadbook[i].night <= 1) {
            iconIndex = 1;
          } else {
            iconIndex = roadbook[i].night;
          }
          if (i === roadbook.length - 1) {
            iconIndex = 0;
          }
          diffIcons = "";
          for (var j = 0; j < difficultyIcon.length; j++) {
            if (j === 0) {
              if (roadbook[i].difficulty === 0) {
                diffIcons = "<img src='/images/" + difficultyIcon[0] + ".png' class='w-[30px] inline' />";
              } else {
                diffIcons = "<img src='/images/" + difficultyIcon[0] + "_in.png' class='w-[30px] inline' />";
              }
            } else {
              if (roadbook[i].difficulty >= j) {
                diffIcons += "<img src='/images/" + difficultyIcon[j] + ".png' class='w-[30px] inline' />";
              } else {
                diffIcons += "<img src='/images/" + difficultyIcon[j] + "_in.png' class='w-[30px] inline' />";
              }
            }
          }
          markers.push(
            leaflet
              .marker([Number(roadbook[i].finParcoursLat), Number(roadbook[i].finParcoursLng)], {
                title: "Arrivée jour " + roadbook[i].dayCounter,
                icon: typeIcons[iconIndex],
              })
              .bindPopup(popupText[i], customOptions)
              .bindTooltip((i + 1).toString(), {
                permanent: true,
                direction: "left",
              }),
          );
        } else {
          // zero day, on affiche le(s) jour(s) précédant(s) en plus
          tempPopupText = "";
          for (var j = i - 1; j >= 0; j--) {
            if (roadbook[j].difficulty === 0) {
              tempPopupText = "<p>" + popupText[j] + "</p>" + tempPopupText;
            } else {
              tempPopupTextId = j;
              j = -1;
            }
          }
          markers.push(
            leaflet
              .marker([Number(roadbook[i].finParcoursLat), Number(roadbook[i].finParcoursLng)], {
                title: "Arrivée jour " + roadbook[i].dayCounter,
                icon: typeIcons[5],
              })
              .bindPopup(
                popupText[tempPopupTextId] +
                  tempPopupText +
                  "<p><b>Jour " +
                  roadbook[i].dayCounter +
                  " : " +
                  roadbook[i].end +
                  "</b></p><p><img src='/images/" +
                  weatherIcon[roadbook[i].weather] +
                  ".png' class='w-[25px] md:w-[30px] inline' />" +
                  "<br/>" +
                  diffIcons +
                  "</p><p>" +
                  roadbook[i].summary +
                  "</p>",
              )
              .bindTooltip((i + 1).toString(), {
                permanent: true,
                direction: "left",
              }),
          );
        }
      }

      var shelterMarkers = leaflet.featureGroup();
      var focusMarkers = leaflet.featureGroup();
      shelterMarkers.addTo(map);
      focusMarkers.addTo(map);
      const focusIndex = Math.min(markers.length, 7);
      for (var i = 0; i < markers.length - focusIndex; i++) {
        var currentShelter = markers[i];
        currentShelter.addTo(shelterMarkers);
      }
      for (var i = markers.length - focusIndex; i < markers.length; i++) {
        var currentShelter = markers[i];
        currentShelter.addTo(focusMarkers);
      }
      map.fitBounds(focusMarkers.getBounds());
    }
  }
</script>

{#if detail}
  <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
    <select
      bind:value={currentRando}
      on:change={loadTables}
      class=" appearance-none block w-full bg-gray-100 text-gray-600 border border-gray-100 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
    >
      {#each randos as r}
        <option value={r.rando}>
          {r.description}
        </option>
      {/each}
    </select>
  </div>
{/if}
<div bind:this={mapElement} id="map" class="w-full" />

<style>
  @import "leaflet/dist/leaflet.css";
  #map {
    width: 100%;
    height: 100dvh;
  }
</style>

<script>
  import { onMount, onDestroy } from "svelte";
  let weatherIcon = [
    "Snow",
    "Rain",
    "Fog",
    "Wind",
    "Thunder",
    "Cloud",
    "SemiSun",
    "Sun",
  ];
  let difficultyIcon = ["ZeroDay", "Star", "Star", "Star"];
  let starIcon = ["Ugly", "Soso", "Star", "Star", "Star"];
  let mapElement;
  let map;
  let roadbook = [];
  let parcours = [];

  onMount(async () => {
    loadTables();
  });

  onDestroy(async () => {
    if (map) {
      console.log("Unloading Leaflet map.");
      map.remove();
    }
  });

  export async function loadTables() {
    let diffIcons = "";
    let landscapeIcons = "";
    let popupText = [];
    let latlngs = [];
    let debutParcours = 100000000;
    let finParcours = 0;
    let currentDay = 1;

    let res = await fetch("/MDB/roadbook?sort=1&map=ok");
    const roa = await res.json();
    roadbook = await roa.roadbook;
    for (var i = 0; i < roadbook.length; i++) {
      if (roadbook[i].debutParcours <= debutParcours) {
        debutParcours = roadbook[i].debutParcours;
      }
      if (roadbook[i].finParcours >= finParcours) {
        finParcours = roadbook[i].finParcours;
      }
      // gestion des zero days sans balise
      // on affecte la balise du jour précédent de fin de parcours
      if (
        Number(roadbook[i].finParcoursLat) +
          Number(roadbook[i].finParcoursLng) ===
        0
      ) {
        for (var j = i - 1; j >= 0; j--) {
          if (
            Number(roadbook[j].finParcoursLat) +
              Number(roadbook[j].finParcoursLng) !=
            0
          ) {
            roadbook[i].debutParcoursLat = Number(roadbook[j].finParcoursLat);
            roadbook[i].debutParcoursLng = Number(roadbook[j].finParcoursLng);
            roadbook[i].finParcoursLat = Number(roadbook[j].finParcoursLat);
            roadbook[i].finParcoursLng = Number(roadbook[j].finParcoursLng);
            j = -1;
          }
        }
      }
    }

    // pour réduire le nombre de points à récupérer dans la base
    let freq = Math.round(Math.max((finParcours - debutParcours) / 5000, 1), 0);
    res = await fetch(
      "/MDB/parcours?freq=" +
        freq +
        "&debutParcours=" +
        debutParcours +
        "&finParcours=" +
        finParcours
    );
    const par = await res.json();
    parcours = await par.parcours;
    console.info("parcours", parcours.length);
    if (typeof window != "undefined") {
      const leaflet = await import("leaflet");

      var starsIcon = new leaflet.Icon({
        iconUrl: "/images/starred.png",
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        popupAnchor: [0, -32],
      });
      var campIcon = new leaflet.Icon({
        iconUrl: "/images/camping-tent.png",
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        popupAnchor: [0, -32],
      });
      var hotelIcon = new leaflet.Icon({
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
      var typeIcons = [starsIcon, campIcon, hotelIcon, reposIcon];
      let iconIndex = 0;

      map = leaflet
        .map(mapElement)
        .setView(
          [
            Number(roadbook[0].debutParcoursLat) +
              (Number(roadbook[roadbook.length - 1].finParcoursLat) -
                Number(roadbook[0].debutParcoursLat)) /
                2,
            Number(roadbook[0].debutParcoursLng) +
              (Number(roadbook[roadbook.length - 1].finParcoursLng) -
                Number(roadbook[0].debutParcoursLng)) /
                2,
          ],
          14
        );

      for (var i = 0; i < parcours.length; i++) {
        // tracé des lignes jour par jour
        if (parcours[i].dayCounter === currentDay) {
          latlngs.push([parcours[i].lat, parcours[i].lng]);
        } else {
          // nouveau jour, on trace le parcours du jour précédent
          // on ajoute la fin d'étape
          leaflet.polyline(latlngs, { color: "blue" }).addTo(map);
          // on réinitialise le parcours
          latlngs = [];
          latlngs.push([parcours[i - 1].lat, parcours[i - 1].lng]);
          currentDay++;
        }
      }
      leaflet.polyline(latlngs, { color: "blue" }).addTo(map);

      leaflet
        .tileLayer("https://a.tile.opentopomap.org/{z}/{x}/{y}.png", {
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        })
        .addTo(map);
      var markers = [];

      markers.push(
        leaflet.marker(
          [
            Number(roadbook[0].debutParcoursLat),
            Number(roadbook[0].debutParcoursLng),
          ],
          {
            title: "départ jour " + roadbook[0].dayCounter,
            icon: typeIcons[iconIndex],
          }
        )
      );

      for (var i = 0; i < roadbook.length; i++) {
        diffIcons = "";
        for (var j = 0; j < difficultyIcon.length; j++) {
          if (j === 0) {
            if (roadbook[i].difficulty === 0) {
              diffIcons =
                "<img src='/images/" +
                difficultyIcon[0] +
                ".png' class='w-[30px] inline' />";
            } else {
              diffIcons =
                "<img src='/images/" +
                difficultyIcon[0] +
                "_in.png' class='w-[30px] inline' />";
            }
          } else {
            if (roadbook[i].difficulty >= j) {
              diffIcons +=
                "<img src='/images/" +
                difficultyIcon[j] +
                ".png' class='w-[30px] inline' />";
            } else {
              diffIcons +=
                "<img src='/images/" +
                difficultyIcon[j] +
                "_in.png' class='w-[30px] inline' />";
            }
          }
        }
        landscapeIcons = "";
        for (var j = 0; j < starIcon.length; j++) {
          if (j === 0) {
            if (roadbook[i].landscape === 0) {
              landscapeIcons =
                "<img src='/images/" +
                starIcon[0] +
                ".png' class='w-[30px] inline' />";
            } else {
              landscapeIcons =
                "<img src='/images/" +
                starIcon[0] +
                "_in.png' class='w-[30px] inline' />";
            }
          }
          if (j === 1) {
            if (roadbook[i].landscape === 1) {
              landscapeIcons +=
                "<img src='/images/" +
                starIcon[1] +
                ".png' class='w-[30px] inline' />";
            } else {
              landscapeIcons +=
                "<img src='/images/" +
                starIcon[1] +
                "_in.png' class='w-[30px] inline' />";
            }
          }
          if (j >= 2) {
            if (roadbook[i].landscape >= j) {
              landscapeIcons +=
                "<img src='/images/" +
                starIcon[j] +
                ".png' class='w-[30px] inline' />";
            } else {
              landscapeIcons +=
                "<img src='/images/" +
                starIcon[j] +
                "_in.png' class='w-[30px] inline' />";
            }
          }
        }

        popupText.push(
          "<p><b>Jour " +
            roadbook[i].dayCounter +
            " : " +
            roadbook[i].start +
            " / " +
            roadbook[i].end +
            "</b></p><p><img src='/images/" +
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
            "</p>"
        );

        // on détermine si il s'agit d'un zero day
        if (roadbook[i].difficulty > 0) {
          if (
            roadbook[i].night === 0 ||
            roadbook[i].night === 1 ||
            roadbook[i].night === 2
          ) {
            iconIndex = 1;
          } else {
            iconIndex = 2;
          }
          if (i === roadbook.length - 1) {
            iconIndex = 0;
          }
          diffIcons = "";
          for (var j = 0; j < difficultyIcon.length; j++) {
            if (j === 0) {
              if (roadbook[i].difficulty === 0) {
                diffIcons =
                  "<img src='/images/" +
                  difficultyIcon[0] +
                  ".png' class='w-[30px] inline' />";
              } else {
                diffIcons =
                  "<img src='/images/" +
                  difficultyIcon[0] +
                  "_in.png' class='w-[30px] inline' />";
              }
            } else {
              if (roadbook[i].difficulty >= j) {
                diffIcons +=
                  "<img src='/images/" +
                  difficultyIcon[j] +
                  ".png' class='w-[30px] inline' />";
              } else {
                diffIcons +=
                  "<img src='/images/" +
                  difficultyIcon[j] +
                  "_in.png' class='w-[30px] inline' />";
              }
            }
          }

          markers.push(
            leaflet
              .marker(
                [
                  Number(roadbook[i].finParcoursLat),
                  Number(roadbook[i].finParcoursLng),
                ],
                {
                  title: "Arrivée jour " + roadbook[i].dayCounter,
                  icon: typeIcons[iconIndex],
                }
              )
              .bindPopup(popupText[i])
          );
        } else {
          // zero day, on affiche le(s) jour(s) précédant(s) en plus
          markers.push(
            leaflet
              .marker(
                [
                  Number(roadbook[i].finParcoursLat),
                  Number(roadbook[i].finParcoursLng),
                ],
                {
                  title: "Arrivée jour " + roadbook[i].dayCounter,
                  icon: typeIcons[3],
                }
              )
              .bindPopup(
                popupText[i - 1] +
                  "<p><b>Jour " +
                  roadbook[i].dayCounter +
                  " : " +
                  roadbook[i].start +
                  "</b></p><p><img src='/images/" +
                  weatherIcon[roadbook[i].weather] +
                  ".png' class='w-[25px] md:w-[30px] inline' />" +
                  "<br/>" +
                  diffIcons +
                  "</p><p>" +
                  roadbook[i].summary +
                  "</p>"
              )
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

<nav>
  <div class="grid grid-cols-4 text-xs md:text-base bg-slate-600 ">
    <div>
      <a
        href="/"
        class=" px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75"
      >
        PCT</a
      >
    </div>
    <div>
      <a
        href="/roadbook"
        class=" px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75"
      >
        GR5
      </a>
    </div>
    <div>
      <a
        href="/parcours"
        class=" px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75"
      >
        GR10
      </a>
    </div>
    <div>
      <a
        href="/map"
        class=" px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75"
      >
        St Guilhem
      </a>
    </div>
  </div>
</nav>
<div bind:this={mapElement} id="map" class="w-full" />

<style>
  @import "leaflet/dist/leaflet.css";
  #map {
    width: 100%;
    height: 100dvh;
  }
</style>

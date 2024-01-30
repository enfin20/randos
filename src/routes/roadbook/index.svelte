<script>
  import { onMount } from "svelte";

  let currentRando = "";
  let randos = [];
  let roadbook = [];
  let parcours = [];
  var buttonLabel = "Add";
  var editDay = Object();
  let rupture = false;

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
  let imgNewWeatherActivate = [
    "_in",
    "_in",
    "_in",
    "_in",
    "_in",
    "_in",
    "_in",
    "_in",
  ];
  let nightIcon = ["Star", "Bivouac", "Camp", "Hotel", "Free"];
  let imgNewNightActivate = ["_in", "_in", "_in", "_in", "_in"];
  let difficultyIcon = ["ZeroDay", "Star", "Star", "Star"];
  let imgNewDifficultyActivate = ["_in", "_in", "_in", "_in"];
  let starsIcon = ["Ugly", "Soso", "Star", "Star", "Star"];
  let imgNewLandscapeActivate = ["_in", "_in", "_in", "_in", "_in"];
  let moodIcon = ["Sad", "Neutral", "Happy"];
  let imgNewMoodActivate = ["_in", "_in", "_in"];
  // _in rgb(200,225,200)

  onMount(async (promise) => {
    let res = await fetch("/MDB/randos");
    const ran = await res.json();
    randos = await ran.randos;
    currentRando = randos[0].rando;
    console.info("randos", randos);
    loadTables();
  });

  async function loadTables() {
    let res = await fetch("/MDB/roadbook?rando=" + currentRando);
    const roa = await res.json();
    roadbook = await roa.roadbook;

    // roadbook vide
    initEditDay();
  }

  function initEditDay() {
    let lastDay = 0;
    let dayId = -1;
    for (var i = 0; i < roadbook.length; i++) {
      if (lastDay < roadbook[i].dayCounter) {
        lastDay = roadbook[i].dayCounter;
        dayId = i;
      }
    }

    if (dayId > -1) {
      editDay.day = roadbook[dayId].day;
      // editDay.day.setDate(editDay.day, getDate() + 1);
      editDay.day = [
        editDay.day.substring(0, 4),
        editDay.day.substring(4, 6),
        editDay.day.substring(6, 8),
      ].join("-");
      var tempDay = new Date(Date.parse(editDay.day));
      tempDay.setDate(tempDay.getDate() + 1);
      editDay.day = tempDay.toJSON().slice(0, 10);
      editDay.start = roadbook[dayId].end;
      editDay.debutParcours = roadbook[dayId].finParcours;
      editDay.finParcours = editDay.debutParcours;
      editDay.dayCounter = roadbook[dayId].dayCounter + 1;
      editDay.cumul = roadbook[dayId].cumul || 0;
      editDay.rando = roadbook[dayId].rando;
    } else {
      editDay.day = new Date().toJSON().slice(0, 10);
      editDay.start = "";
      editDay.debutParcours = 1;
      editDay.finParcours = 0;
      editDay.dayCounter = 1;
      editDay.cumul = 0;
      editDay.rando = currentRando;
    }

    editDay.end = "";
    editDay.weather = -1;
    editDay.difficulty = -1;
    editDay.night = -1;
    editDay.landscape = -1;
    editDay.mood = -1;
    editDay.detail = "";
    editDay.summary = "";
    editDay.debutParcoursLat = 0;
    editDay.debutParcoursLng = 0;
    editDay.dist = 0;
    editDay.elePos = 0;
    editDay.eleNeg = 0;
    editDay.finParcoursLat = 0;
    editDay.finParcoursLng = 0;
    editDay.stepsAnne = 0;
    editDay.stepsOlivier = 0;
    editDay.rupture = false;

    parcours = [];
    buttonLabel = "Add";
  }

  function updateIcons() {
    //mise à jour des icones
    for (var i = 0; i < weatherIcon.length; i++) {
      if (editDay.weather === i) {
        imgNewWeatherActivate[i] = "";
      } else {
        imgNewWeatherActivate[i] = "_in";
      }
    }

    for (var i = 0; i < difficultyIcon.length; i++) {
      if (editDay.difficulty === 0) {
        // zero day
        imgNewDifficultyActivate[0] = "";
        imgNewDifficultyActivate[i] = "_in";
      } else if (editDay.difficulty >= i) {
        imgNewDifficultyActivate[0] = "_in";
        imgNewDifficultyActivate[i] = "";
      } else {
        imgNewDifficultyActivate[i] = "_in";
      }
    }
    for (var i = 0; i < nightIcon.length; i++) {
      if (editDay.night === i) {
        imgNewNightActivate[i] = "";
      } else {
        imgNewNightActivate[i] = "_in";
      }
    }

    for (var i = 0; i < starsIcon.length; i++) {
      if (editDay.landscape === 0) {
        imgNewLandscapeActivate[0] = "";
        imgNewLandscapeActivate[i] = "_in";
      } else if (editDay.landscape === 1) {
        imgNewLandscapeActivate[1] = "";
        imgNewLandscapeActivate[i] = "_in";
      } else if (editDay.landscape === 2) {
        imgNewLandscapeActivate[2] = "";
        imgNewLandscapeActivate[i] = "_in";
      } else if (editDay.landscape === 3) {
        imgNewLandscapeActivate[2] = "";
        imgNewLandscapeActivate[3] = "";
        imgNewLandscapeActivate[i] = "_in";
      } else if (editDay.landscape === 4) {
        imgNewLandscapeActivate[2] = "";
        imgNewLandscapeActivate[3] = "";
        imgNewLandscapeActivate[4] = "";
        imgNewLandscapeActivate[0] = "_in";
        imgNewLandscapeActivate[1] = "_in";
      }
    }

    for (var i = 0; i < moodIcon.length; i++) {
      if (editDay.mood === i) {
        imgNewMoodActivate[i] = "";
      } else {
        imgNewMoodActivate[i] = "_in";
      }
    }
  }

  export async function loadDay(dayCounter) {
    for (var i = 0; i < roadbook.length; i++) {
      if (Number(roadbook[i].dayCounter) === dayCounter) {
        editDay.day = roadbook[i].day;
        editDay.day = [
          editDay.day.substring(0, 4),
          editDay.day.substring(4, 6),
          editDay.day.substring(6, 8),
        ].join("-");
        editDay.start = roadbook[i].start;
        editDay.end = roadbook[i].end;
        editDay.weather = roadbook[i].weather;
        editDay.difficulty = roadbook[i].difficulty;
        editDay.night = roadbook[i].night;
        editDay.landscape = roadbook[i].landscape;
        editDay.mood = roadbook[i].mood;
        editDay.dayCounter = roadbook[i].dayCounter;
        editDay.detail = roadbook[i].detail;
        editDay.summary = roadbook[i].summary;
        editDay.cumul = roadbook[i].cumul;
        editDay.debutParcours = roadbook[i].debutParcours;
        editDay.debutParcoursLat = roadbook[i].debutParcoursLat;
        editDay.debutParcoursLng = roadbook[i].debutParcoursLng;
        editDay.dist = roadbook[i].dist;
        editDay.elePos = roadbook[i].elePos;
        editDay.eleNeg = roadbook[i].eleNeg;
        editDay.finParcours = roadbook[i].finParcours;
        editDay.finParcoursLat = roadbook[i].finParcoursLat;
        editDay.finParcoursLng = roadbook[i].finParcoursLng;
        editDay.rando = roadbook[i].rando;
        editDay.stepsAnne = roadbook[i].stepsAnne;
        editDay.stepsOlivier = roadbook[i].stepsOlivier;
        editDay.rupture = roadbook[i].rupture || false;
      }
    }

    console.info("Load editDay", editDay);
    buttonLabel = "Update";
    //mise à jour des icones
    updateIcons();
  }

  export async function insertRoadbook() {
    let new_id = "";
    var res = new Object();
    delete editDay.rupture;
    editDay.day = editDay.day
      .substring(0, 4)
      .concat(editDay.day.substring(5, 7))
      .concat(editDay.day.substring(8, 10));
    editDay.weather = Number(editDay.weather);
    editDay.difficulty = Number(editDay.difficulty);
    editDay.night = Number(editDay.night);
    editDay.landscape = Number(editDay.landscape);
    editDay.mood = Number(editDay.mood);
    editDay.dayCounter = Number(editDay.dayCounter);
    editDay.cumul = Number(editDay.cumul);
    editDay.debutParcours = Number(editDay.debutParcours);
    editDay.debutParcoursLat = Number(editDay.debutParcoursLat);
    editDay.debutParcoursLng = Number(editDay.debutParcoursLng);
    editDay.dist = Number(editDay.dist);
    editDay.elePos = Number(editDay.elePos);
    editDay.eleNeg = Number(editDay.eleNeg);
    editDay.finParcours = Number(editDay.finParcours);
    editDay.finParcoursLat = Number(editDay.finParcoursLat);
    editDay.finParcoursLng = Number(editDay.finParcoursLng);
    editDay.stepsAnne = Number(editDay.stepsAnne);
    editDay.stepsOlivier = Number(editDay.stepsOlivier);
    console.info("Update day", editDay);
    console.info("buttonLabel", buttonLabel);

    if (buttonLabel === "Add") {
      console.info("ADD");
      // Insert new day
      res = await fetch("/MDB/parcours", {
        method: "POST",
        body: JSON.stringify(parcours),
      });
      new_id = await res.json();

      res = await fetch("/MDB/roadbook", {
        method: "POST",
        body: JSON.stringify(editDay),
      });
      new_id = await res.json();

      // Insertion du nouveau day dans roadbook en première place
      roadbook.unshift({
        day: editDay.day,
        start: editDay.start,
        end: editDay.end,
        weather: editDay.weather,
        difficulty: editDay.difficulty,
        night: editDay.night,
        landscape: editDay.landscape,
        mood: editDay.mood,
        detail: editDay.detail,
        summary: editDay.summary,
        dayCounter: editDay.dayCounter,
        cumul: editDay.cumul,
        debutParcours: editDay.debutParcours,
        debutParcoursLat: editDay.debutParcoursLat,
        debutParcoursLng: editDay.debutParcoursLng,
        dist: editDay.dist,
        elePos: editDay.elePos,
        eleNeg: editDay.eleNeg,
        finParcours: editDay.finParcours,
        finParcoursLat: editDay.finParcoursLat,
        finParcoursLng: editDay.finParcoursLng,
        stepsAnne: editDay.stepsAnne,
        stepsOlivier: editDay.stepsOlivier,
        rupture: editDay.rupture,
        rando: editDay.rando,
      });
      roadbook = roadbook;
    } else {
      console.info("UPDATE");
      console.info("parcours.length", parcours.length);
      // update day
      if (parcours.length > 0) {
        res = await fetch("/MDB/parcours", {
          method: "POST",
          body: JSON.stringify(parcours),
        });
        new_id = await res.json();
      }

      res = await fetch("/MDB/roadbook", {
        method: "PUT",
        body: JSON.stringify(editDay),
      });

      //mise à jour du tableau
      for (var i = 0; i < roadbook.length; i++) {
        if (roadbook[i].dayCounter === editDay.dayCounter) {
          roadbook[i].day = editDay.day;
          roadbook[i].start = editDay.start;
          roadbook[i].end = editDay.end;
          roadbook[i].weather = Number(editDay.weather);
          roadbook[i].difficulty = Number(editDay.difficulty);
          roadbook[i].night = Number(editDay.night);
          roadbook[i].landscape = Number(editDay.landscape);
          roadbook[i].mood = Number(editDay.mood);
          roadbook[i].detail = editDay.detail;
          roadbook[i].summary = editDay.summary;
          roadbook[i].cumul = Number(editDay.cumul);
          roadbook[i].debutParcours = Number(editDay.debutParcours);
          roadbook[i].debutParcoursLat = Number(editDay.debutParcoursLat);
          roadbook[i].debutParcoursLng = Number(editDay.debutParcoursLng);
          roadbook[i].dist = Number(editDay.dist) || 0;
          roadbook[i].elePos = Number(editDay.elePos) || 0;
          roadbook[i].eleNeg = Number(editDay.eleNeg) || 0;
          roadbook[i].finParcours = Number(editDay.finParcours);
          roadbook[i].finParcoursLat = Number(editDay.finParcoursLat);
          roadbook[i].finParcoursLng = Number(editDay.finParcoursLng);
          roadbook[i].rando = editDay.rando;
          roadbook[i].stepsAnne = Number(editDay.stepsAnne);
          roadbook[i].stepsOlivier = Number(editDay.stepsOlivier);
        }
      }
    }
    initEditDay();
  }

  export async function parcoursUpload(evt) {
    let fl_files = evt.target.files; // JS FileList object
    var file = fl_files[0];
    let reader = new FileReader(); // built in API
    reader.onload = function (progressEvent) {
      // Entire file
      const text = this.result;
      console.info("parcours upload editDay", editDay);
      var pos = 0;
      var element = "";
      var prev_lat = 0;
      var prev_lng = 0;
      var prev_ele = 0;
      var data = [];
      var pi = Math.PI;
      var dayDist = 0;
      var dayElePos = 0;
      var dayEleNeg = 0;

      // By lines
      var lines = text.split("\n");
      var counter = 0;

      var prev_cumul = editDay.cumul || 0;
      console.info("prev_cumul", prev_cumul);
      for (var i = 0; i < lines.length; i++) {
        if (lines[i].trim().substring(0, 6) === "<trkpt") {
          var editParcours = Object();
          /* 
              <trkpt lat="45.106969" lon="6.578321">
                <ele>2720.8</ele>
          */
          element = lines[i]
            .trim()
            .replace("<trkpt ", "")
            .replace('lat="', "")
            .replace('" lon="', "/")
            .replace('">', "/")
            .concat(
              lines[i + 1].trim().replace("<ele>", "").replace("</ele>", "")
            );

          data = element.split("/");
          editParcours.rando = editDay.rando;
          editParcours.lat = Number(data[0]);
          editParcours.lng = Number(data[1]);
          editParcours.ele = Number(Math.round(data[2]));
          editParcours.dayCounter = editDay.dayCounter;
          if (counter === 0 && !editDay.rupture) {
            // Premier point de la journéee, ne pas tenir compte du précédent point
            pos = editDay.debutParcours;
            prev_ele = editParcours.ele;
            editParcours.dist = 0;
            editDay.debutParcoursLat = editParcours.lat;
            editDay.debutParcoursLng = editParcours.lng;
          } else if (counter === 0 && editDay.rupture) {
            // Premier point des chargements suivant de la même journée
            pos = editDay.finParcours;
            prev_ele = editParcours.ele;
            editParcours.dist = 0;
            editDay.rupture = false;
            dayElePos = editDay.elePos;
            dayEleNeg = editDay.eleNeg;
          } else {
            editParcours.dist =
              Math.round(
                Math.acos(
                  Math.sin((prev_lat * pi) / 180) *
                    Math.sin((editParcours.lat * pi) / 180) +
                    Math.cos((prev_lat * pi) / 180) *
                      Math.cos((editParcours.lat * pi) / 180) *
                      Math.cos(((prev_lng - editParcours.lng) * pi) / 180)
                ) *
                  6371 *
                  1000
              ) || 0;
          }

          editParcours.cumul = prev_cumul + editParcours.dist;
          if (editParcours.ele - prev_ele > 0) {
            editParcours.elePos = Math.round(editParcours.ele - prev_ele);
            editParcours.eleNeg = 0;
          } else {
            editParcours.eleNeg = Math.round(editParcours.ele - prev_ele);
            editParcours.elePos = 0;
          }

          dayDist += editParcours.dist;
          editParcours.pos = pos;
          dayElePos += editParcours.elePos;
          dayEleNeg += editParcours.eleNeg;
          parcours.push(editParcours);

          prev_lat = editParcours.lat;
          prev_lng = editParcours.lng;
          prev_ele = editParcours.ele;
          prev_cumul = editParcours.cumul;

          pos++;
          counter++;
        }
      }
      console.info("parcours", parcours.length);
      if (rupture) {
        parcours[parcours.length - 1].rupture = rupture;
        editDay.rupture = rupture;
        rupture = false;
      }

      editDay.dist += Math.round(dayDist / 100) / 10;
      editDay.cumul += dayDist;
      editDay.elePos = dayElePos;
      editDay.eleNeg = dayEleNeg;

      editDay.finParcours = pos - 1;
      editDay.finParcoursLat = editParcours.lat;
      editDay.finParcoursLng = editParcours.lng;
    };
    reader.readAsText(file);

    console.info("editDay", editDay);
  }
</script>

<div class="py-2 grid gap-1">
  <div class="grid grid-cols-1 place-content-center w-full">
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
    <div class=" w-full md:w-1/2 flex flex-wrap -mx-3">
      <div class="w-1/3 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Jour
        </label>
        <input
          type="text"
          bind:value={editDay.dayCounter}
          class=" appearance-none block w-full bg-gray-100 text-gray-600 border border-gray-100 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
        />
      </div>

      <div class="w-full md:w-2/3 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          trace
        </label>
        <input
          id="upload"
          type="file"
          accept=".gpx"
          name="files"
          size="30"
          on:change={parcoursUpload}
          class=" appearance-none w-1/2 bg-gray-100 text-gray-600 border border-gray-100 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
        /><label class=" appearance-none w-1/2"
          >Rupture
          <input type="checkbox" bind:checked={rupture} />
        </label>
      </div>
    </div>
    <div class=" w-full md:w-1/2 flex flex-wrap -mx-3">
      <div class="w-1/3 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          distance
        </label>
        <input
          type="text"
          bind:value={editDay.dist}
          class=" appearance-none block w-full bg-gray-100 text-gray-600 border border-gray-100 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
        />
      </div>
      <div class="w-1/3 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Positif
        </label>
        <input
          type="text"
          bind:value={editDay.elePos}
          class=" appearance-none block w-full bg-gray-100 text-gray-600 border border-gray-100 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
        />
      </div>
      <div class="w-1/3 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Negatif</label
        >
        <input
          type="text"
          bind:value={editDay.eleNeg}
          class=" appearance-none block w-full bg-gray-100 text-gray-600 border border-gray-100 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
        />
      </div>
    </div>
    <div class=" w-full md:w-1/2 flex flex-wrap -mx-3">
      <div class="w-1/2 md:w-1/3 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Date
        </label>
        <input
          type="date"
          bind:value={editDay.day}
          class=" appearance-none block w-full bg-gray-100 text-gray-600 border border-gray-100 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
        />
      </div>
      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Début
        </label>
        <input
          type="text"
          bind:value={editDay.start}
          class=" appearance-none block w-full bg-gray-100 text-gray-600 border border-gray-100 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
        />
      </div>
      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Fin
        </label>
        <input
          type="text"
          bind:value={editDay.end}
          class=" appearance-none block w-full bg-gray-100 text-gray-600 border border-gray-100 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
        />
      </div>
    </div>
    <div class=" w-full md:w-1/2 flex flex-wrap -mx-3">
      <div class="w-0 md:w-1/3  px-3 mb-6 md:mb-0" />
      <div class="w-1/2 md:w-1/3 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Fin lat.
        </label>
        <input
          type="text"
          bind:value={editDay.finParcoursLat}
          class=" appearance-none block w-full bg-gray-100 text-gray-600 border border-gray-100 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
        />
      </div>
      <div class="w-1/2 md:w-1/3 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Fin lng.
        </label>
        <input
          type="text"
          bind:value={editDay.finParcoursLng}
          class=" appearance-none block w-full bg-gray-100 text-gray-600 border border-gray-100 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
        />
      </div>
    </div>

    <div class=" w-full md:w-1/2 flex flex-wrap -mx-3">
      <div class="w-1/2 md:w-1/3  px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Pas A.
        </label>
        <input
          type="text"
          bind:value={editDay.stepsAnne}
          class=" appearance-none block w-full bg-gray-100 text-gray-600 border border-gray-100 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
        />
      </div>
      <div class="w-1/2 md:w-1/3 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Pas O.
        </label>
        <input
          type="text"
          bind:value={editDay.stepsOlivier}
          class=" appearance-none block w-full bg-gray-100 text-gray-600 border border-gray-100 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
        />
      </div>
      <div class="w-1/2 md:w-1/3 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Randonnée
        </label>
        <input
          type="text"
          bind:value={editDay.rando}
          class=" appearance-none block w-full bg-gray-100 text-gray-600 border border-gray-100 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
        />
      </div>
    </div>

    <div class=" w-full md:w-1/2 flex flex-wrap -mx-3 mb-6">
      <div class="w-full px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Météo
        </label>
        {#each weatherIcon as wi, i}
          <input
            type="radio"
            bind:group={editDay.weather}
            name="r_weather"
            value={i}
            id="r_weather{i}"
            class="peer hidden"
            on:change={updateIcons}
          />
          <label
            for="r_weather{i}"
            class="select-none cursor-pointer  py-1 px-1 font-bold text-slate-400 transition-colors duration-200 ease-in-out  "
          >
            <img
              src="/images/{wi}{imgNewWeatherActivate[i]}.png"
              alt=""
              class="w-[30px] inline"
            /></label
          >
        {/each}
      </div>
      <div class="w-full px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Difficulté
        </label>
        {#each difficultyIcon as di, i}
          <input
            type="radio"
            bind:group={editDay.difficulty}
            name="r_difficulty"
            value={i}
            id="r_difficulty{i}"
            class="peer hidden"
            on:change={updateIcons}
          />
          <label
            for="r_difficulty{i}"
            class="select-none cursor-pointer py-1 px-1 font-bold text-slate-400 transition-colors duration-200 ease-in-out "
          >
            <img
              src="/images/{di}{imgNewDifficultyActivate[i]}.png"
              alt=""
              class="w-[40px] inline"
            /></label
          >
        {/each}
      </div>
      <div class="w-full px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Nuit
        </label>
        {#each nightIcon as ni, i}
          <input
            type="radio"
            bind:group={editDay.night}
            name="r_night"
            value={i}
            id="r_night{i}"
            class="peer hidden"
            on:change={updateIcons}
          />
          <label
            for="r_night{i}"
            class="select-none cursor-pointer py-1 px-1 font-bold text-slate-400 transition-colors duration-200 ease-in-out "
          >
            <img
              src="/images/{ni}{imgNewNightActivate[i]}.png"
              alt=""
              class="w-[40px] inline"
            /></label
          >
        {/each}
      </div>
      <div class="w-full px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Paysage
        </label>
        {#each starsIcon as si, i}
          <input
            type="radio"
            bind:group={editDay.landscape}
            name="r_landscape"
            value={i}
            id="r_landscape{i}"
            class="peer hidden"
            on:change={updateIcons}
          />
          <label
            for="r_landscape{i}"
            class="select-none cursor-pointer py-1 px-1 font-bold text-slate-400 transition-colors duration-200 ease-in-out "
          >
            <img
              src="/images/{si}{imgNewLandscapeActivate[i]}.png"
              alt=""
              class="w-[40px] inline"
            /></label
          >
        {/each}
      </div>
      <div class="w-full px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Humeur
        </label>
        {#each moodIcon as mi, i}
          <input
            type="radio"
            bind:group={editDay.mood}
            name="mood"
            value={i}
            id="r_mood{i}"
            class="peer hidden"
            on:change={updateIcons}
          />
          <label
            for="r_mood{i}"
            class="select-none cursor-pointer py-1 px-1 font-bold text-slate-400 transition-colors duration-200 ease-in-out "
          >
            <img
              src="/images/{mi}{imgNewMoodActivate[i]}.png"
              alt=""
              class="w-[40px] inline"
            /></label
          >
        {/each}
      </div>
      <div class="w-full px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Résumé
        </label>
        <textarea
          bind:value={editDay.summary}
          class=" w-full appearance-none border-gray-100 bg-gray-100 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none"
          rows="5"
        />
      </div>
      <div class="w-full px-3 mb-6 md:mb-3">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Détails
        </label>
        <textarea
          bind:value={editDay.detail}
          class=" w-full appearance-none border-gray-100 bg-gray-100 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none"
          rows="20"
        />
      </div>
      <div class="w-1/2 px-3 mb-6 md:mb-0">
        <button
          class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          on:click={insertRoadbook}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  </div>
  <div class="w-full md:w-1/2 flex flex-wrap">
    <table id="rdb" class="w-full text-xs text-gray-500 bg-white">
      <tbody class="">
        {#each roadbook as r}
          <tr
            class="align-middle text-center border-collapse border-t-[1px] border-slate-200"
          >
            <td class="text-left align-middle py-1 ">
              {r.day.substring(6, 8).concat("/").concat(r.day.substring(4, 6))}
            </td>
            <td class="text-left align-middle py-1 px-px ">
              <img
                src="/images/{moodIcon[r.mood]}.png"
                alt=""
                class="w-[25px] md:w-[30px] inline"
              />
            </td>
            <td class="text-left align-middle py-1 px-px ">
              <img
                src="/images/{weatherIcon[r.weather]}.png"
                alt=""
                class="w-[25px] md:w-[30px] inline"
              />
            </td>
            <td class="text-left align-middle py-1 px-px ">
              {#each difficultyIcon as di, i}
                {#if i === 0}
                  {#if r.difficulty === 0}
                    <img
                      src="/images/{difficultyIcon[i]}.png"
                      alt=""
                      class="w-[20px] md:w-[30px] inline"
                    />
                  {:else}
                    <img
                      src="/images/{difficultyIcon[i]}_in.png"
                      alt=""
                      class="w-[20px] md:w-[30px] inline"
                    />
                  {/if}
                {:else if r.difficulty >= i}
                  <img
                    src="/images/{difficultyIcon[i]}.png"
                    alt=""
                    class="w-[20px] md:w-[30px] inline"
                  />
                {:else}
                  <img
                    src="/images/{difficultyIcon[i]}_in.png"
                    alt=""
                    class="w-[20px] md:w-[30px] inline"
                  />
                {/if}
              {/each}
            </td>
            <td class="text-left align-middle py-1  px-px ">
              <img
                src="/images/{nightIcon[r.night]}.png"
                alt=""
                class="w-[25px] md:w-[30px] inline"
              />
            </td>
            <td class="text-left align-middle py-1 px-px ">
              {#each starsIcon as si, i}
                {#if i === 0}
                  {#if r.landscape === 0}
                    <img
                      src="/images/{starsIcon[0]}.png"
                      alt=""
                      class="w-[20px] md:w-[30px] inline"
                    />
                  {:else}
                    <img
                      src="/images/{starsIcon[0]}_in.png"
                      alt=""
                      class="w-[20px] md:w-[30px] inline"
                    />
                  {/if}
                {/if}
                {#if i === 1}
                  {#if r.landscape === 1}
                    <img
                      src="/images/{starsIcon[1]}.png"
                      alt=""
                      class="w-[20px] md:w-[30px] inline"
                    />
                  {:else}
                    <img
                      src="/images/{starsIcon[1]}_in.png"
                      alt=""
                      class="w-[20px] md:w-[30px] inline"
                    />
                  {/if}
                {/if}
                {#if i >= 2}
                  {#if r.landscape >= i}
                    <img
                      src="/images/{starsIcon[i]}.png"
                      alt=""
                      class="w-[20px] md:w-[30px] inline"
                    />
                  {:else}
                    <img
                      src="/images/{starsIcon[i]}_in.png"
                      alt=""
                      class="w-[20px] md:w-[30px] inline"
                    />
                  {/if}
                {/if}
              {/each}
            </td>
            <td class="align-middle py-1 px-1 ">
              <button
                class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
                id={r.dayCounter}
                on:click={loadDay(r.dayCounter)}>Edit</button
              >
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<script>
  import { onMount } from "svelte";
  import chartjs from "chart.js/auto";

  let roadbook = [];
  let totalDistance = 0;
  let totalElePos = 0;
  let totalEleNeg = 0;
  let NbDay = 0;

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

  let nightIcon = ["Star", "Bivouac", "Camp", "Hotel", "Free"];
  let difficultyIcon = ["ZeroDay", "Star", "Star", "Star"];
  let starsIcon = ["Ugly", "Soso", "Star", "Star", "Star"];
  let moodIcon = ["Sad", "Neutral", "Happy"];
  // _in rgb(200,225,200)
  let chartParcours;
  let ctxParcours;
  var chartParcoursData = [];
  let debutParcours = 100000000;
  let finParcours = 0;
  let randos = [];
  let currentRando = "";

  onMount(async (promise) => {
    let res = await fetch("/MDB/randos");
    const ran = await res.json();
    randos = await ran.randos;
    currentRando = randos[0].rando;
    loadTables();
    ctxParcours = chartParcours.getContext("2d");
    chartParcoursData = new chartjs(ctxParcours, {});
  });

  export async function loadTables() {
    let res = await fetch("/MDB/roadbook?sort=1&map=ok&rando=" + currentRando);
    const roa = await res.json();
    roadbook = await roa.roadbook;

    debutParcours = 100000000;
    finParcours = 0;

    for (var i = 0; i < roadbook.length; i++) {
      if (roadbook[i].debutParcours <= debutParcours) {
        debutParcours = roadbook[i].debutParcours;
      }
      if (roadbook[i].finParcours >= finParcours) {
        finParcours = roadbook[i].finParcours;
      }
    }

    loadParcours();
  }

  export async function loadParcours() {
    let distance = [];
    let elevation = [];
    let daysFinParcours = [];
    let parcours = [];
    let freq = 1;
    let borneInf = 0;
    let borneSup = 0;

    // données statistiques globales du parcours sélectionné
    totalElePos = 0;
    totalEleNeg = 0;
    NbDay = 0;
    for (var i = 0; i < roadbook.length; i++) {
      if (roadbook[i].debutParcours === debutParcours) {
        if (i > 0) {
          borneInf = Math.round(roadbook[i - 1].distCumul);
        }
      }
      if (roadbook[i].finParcours === finParcours) {
        borneSup = Math.round(roadbook[i].distCumul);
      }
      if (
        roadbook[i].debutParcours >= debutParcours &&
        roadbook[i].finParcours <= finParcours
      ) {
        totalElePos += roadbook[i].elePos;
        totalEleNeg += roadbook[i].eleNeg;
        NbDay++;
      }
    }
    totalDistance = borneSup - borneInf;

    // pour réduire le nombre de points à récupérer dans la base
    freq = Math.round(Math.max((finParcours - debutParcours) / 2000, 1), 0);
    let res = await fetch(
      "/MDB/parcours?freq=" +
        freq +
        "&debutParcours=" +
        debutParcours +
        "&finParcours=" +
        finParcours +
        "&rando=" +
        currentRando
    );
    const par = await res.json();
    parcours = await par.parcours;
    console.info("Parcours load", parcours);

    // point initial
    let posId = 0;
    distance.push(Math.round(parcours[0].cumul / 1000, 0));
    elevation.push(parcours[0].ele);

    for (var i = borneInf + 1; i <= borneSup; i++) {
      // boucle sur les kms pour entrer l'élévation correspondante
      posId = 0;
      for (var j = 1; j < parcours.length; j++) {
        // on cherche le point le plus proche de chaque km
        if (Math.round(parcours[j].cumul / 1000, 0) <= i) {
          posId = j;
        }
      }
      if (posId > 0) {
        // point trouvé, on rentre le km et son élévation
        distance.push(i);
        elevation.push(parcours[posId].ele);
      }
    }
    for (var j = 0; j < roadbook.length; j++) {
      // pour chaque fin de parcours, on entre le km
      if (
        roadbook[j].finParcours >= debutParcours &&
        roadbook[j].finParcours <= finParcours
      ) {
        daysFinParcours.push(Math.round(roadbook[j].distCumul) - borneInf);
      }
    }

    // traçage des fin de parcours
    const lineMarkerText = {
      id: "lineMarkerText",
      beforeDatasetDraw: (chart, args, plugins) => {
        const {
          data,
          ctx,
          chartArea: { top, bottom },
          scales: { x },
        } = chart;
        ctx.save();
        let zeroDay = 0;
        data.datasets[0].data.forEach((dfp, index) => {
          ctx.beginPath();
          if (x.getPixelForValue(daysFinParcours[index]) === zeroDay) {
            ctx.strokeStyle = "rgb(0, 110, 118)";
            ctx.lineWidth = 3;
          } else {
            ctx.strokeStyle = "rgb(255, 159, 64)";
            ctx.lineWidth = 2;
          }

          ctx.moveTo(x.getPixelForValue(daysFinParcours[index]), top);
          ctx.lineTo(x.getPixelForValue(daysFinParcours[index]), bottom);
          ctx.stroke();
          zeroDay = x.getPixelForValue(daysFinParcours[index]);
        });
      },
    };

    // traçage du parcours
    chartParcoursData.destroy();
    chartParcoursData = new chartjs(ctxParcours, {
      type: "line",
      data: {
        labels: distance,
        datasets: [
          {
            label: "Parcours",
            data: elevation,
          },
        ],
      },
      options: {
        borderWidth: 2,
        cubicInterpolationMode: "monotone",
        pointStyle: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        xaxes: [
          {
            type: "linear" /* <--- this */,
            scalelabel: {
              display: true,
            },
          },
        ],
      },
      plugins: [lineMarkerText],
    });
  }
</script>

<div class="w-full">
  <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
    <select
      bind:value={currentRando}
      on:change={loadTables}
      class="text-xs appearance-none block w-full bg-gray-100 text-gray-600 border border-gray-100 rounded mb-1 leading-tight focus:outline-none focus:bg-white"
    >
      {#each randos as r}
        <option value={r.rando}>
          {r.description}
        </option>
      {/each}
    </select>
  </div>
  <div class="w-full grid grid-cols-1 md:grid-cols-6 mt-5 md:mt-10">
    <select
      bind:value={debutParcours}
      on:change={loadParcours}
      class="text-xs appearance-none block w-full bg-gray-100 text-gray-600 border border-gray-100 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
    >
      {#each roadbook as r}
        <option value={r.debutParcours}>
          Jour {r.dayCounter} : {r.start}
        </option>
      {/each}
    </select>&nbsp;
    <select
      bind:value={finParcours}
      on:change={loadParcours}
      class="text-xs appearance-none block w-full bg-gray-100 text-gray-600 border border-gray-100 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
    >
      {#each roadbook as r}
        <option value={r.finParcours}>
          Jour {r.dayCounter} : {r.end}
        </option>
      {/each}
    </select>
  </div>
  <div class="w-full grid grid-cols-1 text-xs">
    <div>
      Nombre de jours : {NbDay}<br
      />Distance&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {Number(
        totalDistance
      ).toLocaleString("fr")} / {Number(
        Math.round((Number(totalDistance) / Number(NbDay)) * 10) / 10
      ).toLocaleString("fr")} kms<br />Elévation pos : {Number(
        totalElePos
      ).toLocaleString("fr")} / {Math.round(
        Number(totalElePos) / Number(NbDay)
      ).toLocaleString("fr")} m <br />
      Elévation nég : {Number(totalEleNeg).toLocaleString("fr")} / {Math.round(
        Number(totalEleNeg) / Number(NbDay)
      ).toLocaleString("fr")} m
    </div>
  </div>
  <div class="w-full grid grid-cols-1 mt-0 md:mt-5">
    <canvas bind:this={chartParcours} />
  </div>
  <div class="w-full grid grid-cols-1 mt-0 md:mt-5 text-xs md:text-base">
    {#each roadbook as r}
      <div
        class="w-full md:w-full grid grid-cols-3 md:grid-cols-6 align-middle text-center border-collapse border-t-[1px] border-slate-200"
      >
        <div class="">
          Jour {r.dayCounter}: {r.day
            .substring(6, 8)
            .concat("/")
            .concat(r.day.substring(4, 6))}
        </div>
        <div class="">
          {r.start}
        </div>
        <div class="">
          {r.end}
        </div>
        <div class="">
          {r.dist || 0} / {Math.round(Number(r.distCumul)).toLocaleString("fr")}
          kms
        </div>
        <div class="">
          + {Number(r.elePos).toLocaleString("fr") || 0} / {Number(
            r.eleNeg
          ).toLocaleString("fr") || 0} m
        </div>
        <div class="">
          A: {Number(r.stepsAnne || 0).toLocaleString("fr")} - O: {Number(
            r.stepsOlivier || 0
          ).toLocaleString("fr")}
        </div>
        <div class="px-2">
          <img
            src="/images/{moodIcon[r.mood]}.png"
            alt=""
            class="w-[25px] md:w-[30px] inline"
          />
        </div>
        <div class="px-2">
          <img
            src="/images/{weatherIcon[r.weather]}.png"
            alt=""
            class="w-[25px] md:w-[30px] inline"
          />
        </div>
        <div class="px-2">
          <img
            src="/images/{nightIcon[r.night]}.png"
            alt=""
            class="w-[25px] md:w-[30px] inline"
          />
        </div>
        <div class="">
          {#each difficultyIcon as di, i}
            {#if i === 0}
              {#if r.difficulty === 0}
                <img
                  src="/images/{difficultyIcon[i]}.png"
                  alt=""
                  class="w-[15px] md:w-[30px] inline"
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
        </div>

        <div class="">
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
        </div>
      </div>
    {/each}
  </div>
</div>

<script>
  import { onMount } from "svelte";

  onMount(async (promise) => {
    let res = await fetch("/MDB/borne?rando=GUILHEM");
    const roa = await res.json();
    roadbook = await roa.parcours;
  });
</script>

<div class="py-2 grid gap-1">youpi</div>

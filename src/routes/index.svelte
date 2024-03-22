<script>
  import LeafletMap from "$lib/LeafletMap.svelte";
  import Roadbook from "$lib/Roadbook.svelte";
  import { getDetail } from "$lib/detail";
  import { onMount } from "svelte";
  let detail = false;
  onMount(async (promise) => {
    console.info("page", window.location.href);
    detail = getDetail(window.location.href);
  });
</script>

{#if detail}
  <Roadbook />
{:else}
  <LeafletMap bind:detail />
{/if}

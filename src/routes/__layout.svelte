<script>
  import { onMount } from "svelte";
  import { getDetail } from "$lib/detail";
  let detail = false;
  onMount(async () => {
    detail = getDetail(window.location.href);
  });
</script>

<nav>
  {#if detail}
    <div class="grid grid-cols-5 text-xs md:text-base bg-ht px-2 py-2 ">
      <div>
        <a
          href="/?detail"
          class=" px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75"
        >
          Roadbook</a
        >
      </div>
      <div>
        <a
          href="/dashboard"
          class=" px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75"
        >
          Synthèse
        </a>
      </div>
      <div>
        <a
          href="/expenses"
          class=" px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75"
        >
          Dépenses
        </a>
      </div>
      <div>
        <a
          href="/map"
          class=" px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75"
        >
          Carte
        </a>
      </div>
      <div>
        <a
          href="/parcours"
          class=" px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75"
        >
          Parcours
        </a>
      </div>
    </div>
  {:else}
    <div class="grid grid-cols-1 text-xs md:text-base bg-ht px-2 py-2 ">
      <div>
        <a href="/" class=" px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75">
          Suivi parcours A & O
        </a>
      </div>
    </div>
  {/if}
</nav>
<div class="px-2 py-2">
  <div class="mb-2 text-gray-500 font-bold">
    <slot />
  </div>
</div>

<style>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>

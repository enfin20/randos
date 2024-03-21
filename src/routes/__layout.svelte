<script>
  let detail = false;
  import { onMount } from "svelte";
  onMount(async () => {
    if (window.location.href.indexOf("detail") > 0) {
      detail = true;
    }
    console.info("nav", detail);
  });
</script>

<nav>
  <div class="grid grid-cols-3 text-xs md:text-base bg-ht px-2 py-2 ">
    <div>
      <a href="/" class=" px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75">
        RANDOS</a
      >
    </div>
    {#if detail}
      <div>
        <a
          href="/parcours"
          class=" px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75"
        >
          Parcours
        </a>
      </div>

      <div>
        <a
          href="/roadbook"
          class=" px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75"
        >
          Roadbook
        </a>
      </div>
    {/if}
  </div>
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

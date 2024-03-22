<script>
</script>

<nav>
  <div class="grid grid-cols-4 text-xs md:text-base bg-ht px-2 py-2 ">
    <div>
      <a
        href="/"
        class=" px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75"
      >
        RD24</a
      >
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
        href="/categories"
        class=" px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75"
      >
        Cat.
      </a>
    </div>
    <div>
      <a
        href="/categoryTypes"
        class=" px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75"
      >
        Types
      </a>
    </div>
  </div>
</nav>
<div class="px-2 py-2 w-full">
  <div class="flex mb-2 text-gray-500 font-bold">
    <slot />
  </div>
</div>

<style>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>

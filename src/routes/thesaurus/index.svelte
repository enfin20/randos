<script>
  import { onMount } from "svelte";
  let thesaurus = [];
  let new_shortcut = "";
  let new_word = "";
  onMount(async (promise) => {
    let res = await fetch("/MDB/thesaurus");
    const thes = await res.json();
    thesaurus = await thes.thesaurus;
  });

  export async function insertThesaurus(shortcut, word) {
    var obj = new Object();
    obj.shortcut = shortcut;
    obj.word = word;

    const res = await fetch("/MDB/thesaurus", {
      method: "POST",
      body: JSON.stringify(obj),
    });

    // remise à jour du tableau
    thesaurus.unshift(obj);
    thesaurus = thesaurus;
    new_shortcut = "";
    new_word = "";
  }

  export async function updateThesaurus(word, shortcut) {
    var obj = new Object();
    obj.word = word;
    obj.shortcut = shortcut;

    const res = await fetch("/MDB/thesaurus", {
      method: "PUT",
      body: JSON.stringify(obj),
    });
  }
</script>

<div class="py-2 grid gap-1">
  <div class="flex flex-col h-screen">
    <div class="flex-grow overflow-y-auto">
      <table id="CategoriesListe" class="text-sm text-gray-500 w-full relative">
        <thead>
          <tr>
            <th class="w-[30%] sticky top-0 bg-white">Shortcut</th>
            <th class="w-[60%] sticky top-0 bg-white">Word</th>
          </tr>
        </thead>
        <tbody class="">
          <tr class="align-middle text-center border-collapse border-t-[1px] border-slate-200">
            <td class="text-left align-middle py-1 px-1 w-[30%]">
              <input
                type="text"
                bind:value={new_shortcut}
                class=" appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
              />
            </td>
            <td class="text-left align-middle py-1 px-1 w-[30%]">
              <input
                type="text"
                bind:value={new_word}
                class=" appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
              />
            </td>
            <td class="align-middle py-1 px-1 w-[10%]">
              <button
                class="bg-green-600 hover:bg-green-800 text-white py-1 px-1 rounded"
                on:click={insertThesaurus(new_shortcut, new_word)}
                >Add
              </button>
            </td>
          </tr>
          {#each thesaurus as t}
            <tr class="align-middle text-center border-collapse border-t-[1px] border-slate-200">
              <td class="text-left align-middle py-1 px-1 w-[30%]">
                <input
                  type="text"
                  bind:value={t.shortcut}
                  class="appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
                />
              </td>
              <td class="text-left align-middle py-1 px-1 w-[60%]">
                <input
                  type="text"
                  bind:value={t.word}
                  class="appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
                />
              </td>
              <td class="align-middle py-1 px-1 w-[5%]">
                <button
                  class="bg-green-400 hover:bg-green-600 text-gray-500 py-1 px-1 rounded"
                  id={t.key}
                  on:click={updateThesaurus(t.word, t.shortcut)}>Update</button
                >
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>

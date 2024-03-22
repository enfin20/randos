<script context="module">
</script>

<script>
  let new_type = "";
  import { onMount } from "svelte";

  let categoryTypes = [];

  onMount(async (promise) => {
    let res = [];
    //initialisation du tableau en fonction de la source

    res = await fetch("/MDB/categoryTypes");
    const typ = await res.json();
    categoryTypes = await typ.categoryTypes;
  });

  export async function updateType(key, type) {
    var obj = new Object();
    obj.key = key;
    obj.type = type;

    const res = await fetch("/MDB/categoryTypes", {
      method: "PUT",
      body: JSON.stringify(obj),
    });
  }

  export async function deleteType(key) {
    var obj = new Object();
    obj.key = key;

    const res = await fetch("/MDB/categoryTypes", {
      method: "DELETE",
      body: JSON.stringify(obj),
    });

    // remise à jour du tableau
    let remove_elt = "";
    for (var i = 0; i < categoryTypes.length; i++) {
      if (categoryTypes[i].key === key) {
        remove_elt = i;
      }
    }
    const deleted = categoryTypes.splice(remove_elt, 1);
    categoryTypes = categoryTypes;
  }

  export async function insertType(type) {
    let new_key = "";
    var obj = new Object();
    obj.type = type;

    const res = await fetch("/MDB/categoryTypes", {
      method: "POST",
      body: JSON.stringify(type),
    });
    new_key = await res.json();
    obj.key = new_key.message;

    // remise à jour du tableau
    categoryTypes.unshift(obj);
    categoryTypes = categoryTypes;
    new_type = "";
  }
</script>

<div class="py-2 grid gap-1">
  <div class="flex flex-col h-screen">
    <div class="flex-grow overflow-y-auto">
      <table id="CategoriesListe" class="text-sm text-gray-500 w-full relative">
        <thead>
          <tr>
            <th class="w-[90%] sticky top-0 bg-white">Type</th>
          </tr>
        </thead>
        <tbody class="">
          <tr
            class="align-middle text-center border-collapse border-t-[1px] border-slate-200"
          >
            <td class="text-left align-middle py-1 px-1 w-[90%]">
              <input
                type="text"
                bind:value={new_type}
                class=" appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
              />
            </td>
            <td class="align-middle py-1 px-1 w-[10%]">
              <button
                class="bg-green-600 hover:bg-green-800 text-white py-1 px-1 rounded"
                on:click={insertType(new_type)}
                >Add
              </button>
            </td>
          </tr>
          {#each categoryTypes as t}
            <tr
              class="align-middle text-center border-collapse border-t-[1px] border-slate-200"
            >
              <td class="text-left align-middle py-1 px-1 w-[90%]">
                <input
                  type="text"
                  bind:value={t.type}
                  class="appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
                />
              </td>
              <td class="align-middle py-1 px-1 w-[5%]">
                <button
                  class="bg-green-400 hover:bg-green-600 text-gray-500 py-1 px-1 rounded"
                  id={t.key}
                  on:click={updateType(t.key, t.type)}>Update</button
                >
              </td>
              <td class="align-middle py-1 px-1 w-[5%]">
                <button
                  class="bg-red-400 hover:bg-red-600 text-gray-500 py-1 px-1 rounded"
                  id={t.key}
                  on:click={deleteType(t.key)}>Delete</button
                >
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>

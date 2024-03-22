<script context="module">
</script>

<script>
  let new_category = "";
  let new_type = "";
  import { onMount } from "svelte";

  let categories = [];
  let categoryTypes = [];

  onMount(async (promise) => {
    let res = [];
    res = await fetch("/MDB/categoryTypes");
    const typ = await res.json();
    categoryTypes = await typ.categoryTypes;

    res = await fetch("/MDB/categories");
    const cat = await res.json();
    categories = await cat.categories;
  });

  export async function updateCategory(key, category, type) {
    var obj = new Object();
    obj.key = key;
    obj.type = type;
    obj.category = category;

    const res = await fetch("/MDB/categories", {
      method: "PUT",
      body: JSON.stringify(obj),
    });
  }

  export async function deleteCategory(key) {
    var obj = new Object();
    obj.key = key;

    const res = await fetch("/MDB/categories", {
      method: "DELETE",
      body: JSON.stringify(obj),
    });

    // remise à jour du tableau
    let remove_elt = "";
    for (var i = 0; i < categories.length; i++) {
      if (categories[i].key === key) {
        remove_elt = i;
      }
    }

    const deleted = categories.splice(remove_elt, 1);
    categories = categories;
  }

  export async function insertCategory(category, type) {
    let new_key = "";
    var obj = new Object();
    obj.category = category;
    obj.type = type;

    const res = await fetch("/MDB/categories", {
      method: "POST",
      body: JSON.stringify(obj),
    });
    new_key = await res.json();
    obj.key = new_key.message;

    // remise à jour du tableau
    categories.unshift(obj);
    categories = categories;
    new_category = "";
    new_type = "";
  }
</script>

<div class="py-2 grid gap-1">
  <div class="flex flex-col h-screen">
    <div class="flex-grow overflow-y-auto">
      <table id="CategoriesListe" class="text-sm text-gray-500 w-full relative">
        <thead>
          <tr>
            <th class="w-[45%] sticky top-0 bg-white">Category</th>
            <th class="w-[45%] sticky top-0 bg-white">Type</th>
          </tr>
        </thead>
        <tbody class="">
          <tr
            class="align-middle text-center border-collapse border-t-[1px] border-slate-200"
          >
            <td class="text-left align-middle py-1 px-1 w-[45%]">
              <input
                type="text"
                bind:value={new_category}
                class=" appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
              />
            </td>
            <td class="text-left align-middle py-1 px-1 w-[45%]">
              <select
                bind:value={new_type}
                class=" appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
              >
                {#each categoryTypes as t}
                  <option value={t.type}>
                    {t.type}
                  </option>
                {/each}
              </select>
            </td>
            <td class="align-middle py-1 px-1 w-[10%]">
              <button
                class="bg-green-600 hover:bg-green-800 text-white py-1 px-1 rounded"
                on:click={insertCategory(new_category, new_type)}
                >Add
              </button>
            </td>
          </tr>
          {#each categories as c}
            <tr
              class="align-middle text-center border-collapse border-t-[1px] border-slate-200"
            >
              <td class="text-left align-middle py-1 px-1 w-[45%]">
                <input
                  type="text"
                  bind:value={c.category}
                  class="appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
                />
              </td>
              <td class="text-left align-middle py-1 px-1 w-[45%]">
                <select
                  bind:value={c.type}
                  class=" appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
                >
                  {#each categoryTypes as t}
                    <option value={t.type}>
                      {t.type}
                    </option>
                  {/each}
                </select>
              </td>
              <td class="align-middle py-1 px-1 w-[5%]">
                <button
                  class="bg-green-400 hover:bg-green-600 text-gray-500 py-1 px-1 rounded"
                  id={c.key}
                  on:click={updateCategory(c.key, c.category, c.type)}
                  >Update</button
                >
              </td>
              <td class="align-middle py-1 px-1 w-[5%]">
                <button
                  class="bg-red-400 hover:bg-red-600 text-gray-500 py-1 px-1 rounded"
                  id={c._id}
                  on:click={deleteCategory(c.key)}>Delete</button
                >
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>

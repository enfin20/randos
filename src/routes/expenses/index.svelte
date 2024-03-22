<script context="module">
</script>

<script>
  let new_month = "";
  let new_amount = "";
  let new_description = "";
  let new_category = "";
  let new_payer=""
  let months = [
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
  ];
  let payers=["Anne", "Olivier"]
  import { onMount } from "svelte";

  let categories = [];
  let expenses = [];

  onMount(async (promise) => {
    let res = [];
    res = await fetch("/MDB/categories");
    const cat = await res.json();
    categories = await cat.categories;

    res = await fetch("/MDB/expenses");
    const exp = await res.json();
    expenses = await exp.expenses;
  });

  export async function updateExpense(
    key,
    month,
    amount,
    description,
    category,
    payer,
  ) {
    var obj = new Object();
    obj.key = key;
    obj.month = month;
    obj.amount = amount;
    obj.description = description;
    obj.category = category;
    obj.payer = payer;

    const res = await fetch("/MDB/expenses", {
      method: "PUT",
      body: JSON.stringify(obj),
    });
  }

  export async function deleteExpense(key) {
    var obj = new Object();
    obj.key = key;

    const res = await fetch("/MDB/expenses", {
      method: "DELETE",
      body: JSON.stringify(obj),
    });

    // remise à jour du tableau
    let remove_elt = "";
    for (var i = 0; i < expenses.length; i++) {
      if (expenses[i].key === key) {
        remove_elt = i;
      }
    }
    const deleted = expenses.splice(remove_elt, 1);
    expenses = expenses;
  }

  export async function insertExpense(month, amount, description, category, payer) {
    let new_key = "";
    var obj = new Object();
    obj.month = month;
    obj.amount = amount;
    obj.description = description;
    obj.category = category;
    obj.payer = payer;

    const res = await fetch("/MDB/expenses", {
      method: "POST",
      body: JSON.stringify(obj),
    });
    new_key = await res.json();
    obj.key = new_key.message;

    // remise à jour du tableau
    expenses.unshift(obj);
    expenses = expenses;
    new_month = "";
    new_amount = "";
    new_description = "";
    new_category = "";
    new_payer="";
  }
</script>

<div class="mt-5 w-full md:w-2/3">
      <table id="ExpensesListe" class="text-sm text-gray-500 table-auto">
        <thead>
          <tr>
            <th>Mois</th>
            <th>Montant</th>
            <th>Description</th>
            <th>Catégorie</th>
            <th>Qui</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody class="">
          <tr
            class="align-middle text-center border-collapse border-t-[1px] border-slate-200"
          >
            <td class="text-left align-middle py-1 px-1 w-1/12">
              <select
                bind:value={new_month}
                class="text-xs appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
              >
                {#each months as m}
                  <option value={m}>
                    {m}
                  </option>
                {/each}
              </select>
            </td>
            <td class="text-left align-middle py-1 px-1 w-1/12">
              <input
                type="text"
                bind:value={new_amount}
                class="text-xs appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
              />
            </td>
            <td class="text-left align-middle py-1 px-1 w-1/3">
              <input
                type="text"
                bind:value={new_description}
                class="text-xs appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
              />
            </td>
            <td class="text-left align-middle py-1 px-1 w-1/6">
              <select
                bind:value={new_category}
                class="text-xs appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
              >
                {#each categories as category}
                  <option value={category.category}>
                    {category.category}
                  </option>
                {/each}
              </select>
            </td>
            <td class="text-left align-middle py-1 px-1 w-1/6">
              <select
                bind:value={new_payer}
                class="text-xs appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
              >
                {#each payers as payer}
                  <option value={payer}>
                    {payer}
                  </option>
                {/each}
              </select>
            </td>
            <td class="align-middle py-1 px-1 w-1/12">
              <button
                class="text-xs bg-green-600 hover:bg-green-800 text-white py-1 px-1 rounded"
                on:click={insertExpense(
                  new_month,
                  new_amount,
                  new_description,
                  new_category,
                  new_payer
                )}
                >Add
              </button>
            </td>
            <td class="align-middle py-1 px-1 w-1/12"></td>
          </tr>
          {#each expenses as e}
            <tr class="align-middle text-center border-collapse border-t-[1px] border-slate-200">
              <td class="text-left align-middle py-1 px-1 w-1/12">
                <select
                  bind:value={e.month}
                  class="text-xs appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
                >
                  {#each months as m}
                    <option value={m}>
                      {m}
                    </option>
                  {/each}
                </select>
              </td>
              <td class="text-left align-middle py-1 px-1 w-1/12">
                <input
                  type="text"
                  bind:value={e.amount}
                  class="text-xs appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
                />
              </td>
              <td class="text-left align-middle py-1 px-1 w-1/3">
                <input
                  type="text"
                  bind:value={e.description}
                  class="text-xs appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
                />
              </td>
              <td class="text-left align-middle py-1 px-1 w-1/6">
                <select
                  bind:value={e.category}
                  class="text-xs appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
                >
                  {#each categories as c}
                    <option value={c.category}>
                      {c.category}
                    </option>
                  {/each}
                </select>
              </td>
              <td class="text-left align-middle py-1 px-1 w-1/6">
                <select
                  bind:value={e.payer}
                  class="text-xs appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
                >
                  {#each payers as payer}
                    <option value={payer}>
                      {payer}
                    </option>
                  {/each}
                </select>
              </td>
              <td class="align-middle py-1 px-1 w-1/12">
                <button
                  class="text-xs bg-green-400 hover:bg-green-600 text-gray-500 py-1 px-1 rounded"
                  id={e.key}
                  on:click={updateExpense(
                    e.key,
                    e.month,
                    e.amount,
                    e.description,
                    e.category,
                    e.payer
                  )}>Update</button>
                  </td>
                  <td class="align-middle py-1 px-1 w-1/12">
                <button
                  class="text-xs bg-red-400 hover:bg-red-600 text-gray-500 py-1 px-1 rounded"
                  id={e.key}
                  on:click={deleteExpense(e.key)}>Delete</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
</div>

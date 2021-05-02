<template>
  <div class="bg-gray-200 rounded-md p-3">
    <h1 class="text-2xl text-red-400">{{ title }}</h1>
    <!-- This example requires Tailwind CSS v2.0+ -->
    <div class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div
            class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
          >
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Turn Name
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Check In
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Check Out
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Break Time
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Working Hours
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    List of Workers
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(turn, idx) in turnTemplates" :key="idx">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ turn.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ turn.checkIn }} hrs.
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ turn.checkOut }} hrs.
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ turn.breakTime }} min.
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ calculateWorkingTime(turn) }} hrs.
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-full"
                  >
                    <ol
                      v-for="({ fullName, employeeId }, idx) in turn.users"
                      :key="idx"
                    >
                      <li>
                        {{ fullName }}
                        <div
                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                        >
                          {{ employeeId }}
                        </div>
                      </li>
                    </ol>
                  </td>
                </tr>

                <!-- More people... -->
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchDataAsync } from '../services/fetch';
// import { sortArrayByProperty } from '../services/compare';
export default {
  data() {
    return {
      title: 'Plantillas',
      turnTemplates: [],
      users: [],
      defImg:
        'https://www.gravatar.com/avatar/3c58cbad936e4dbd5350510cf27146b2?d=mp&s=200',
    };
  },
  methods: {
    functionToLog: function () {
      console.log('sa');
    },
    calculateWorkingTime(turn) {
      const { checkIn, checkOut } = turn; // discount or not breakTime
      const start = new Date(`2021-09-13 ${checkIn}:00`),
        end = new Date(`2021-09-13 ${checkOut}:00`); // Math.abs(checkIn);

      let difference = end - start;
      difference = difference / 60 / 60 / 1000;
      return difference;
    },
    /* getFullAddress: (turn) => {
      return [
        turn.address1,
        turn.address2,
        turn.commune,
        turn.region,
      ]
        .filter((str) => str)
        .join(', ');
    }, */
  },
  async mounted() {
    const fetchedPositions = await fetchDataAsync(
      'http://localhost:3004/positions'
    );
    const fetchedLocations = await fetchDataAsync(
      'http://localhost:3004/locations'
    );
    const fetchedTurnTemplates = await fetchDataAsync(
      'http://localhost:3004/turnTemplates'
    );
    // this.users = sortArrayByProperty(fetchedUsers, 'firstName', 'string', -1);
    let locations = fetchedLocations;
    console.warn(fetchedPositions, locations);
    console.log(fetchedTurnTemplates);
    this.turnTemplates = fetchedTurnTemplates;
  },
};
</script>

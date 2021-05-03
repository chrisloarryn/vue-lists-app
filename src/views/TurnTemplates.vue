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
                    Position Name
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    List of Locations
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
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ turn.positionName || '[Sin Registrar]' }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-full"
                  >
                    <ol v-for="(name, idx) in turn.locationsName" :key="idx">
                      <li>
                        {{ name }}
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
import { sortArrayByProperty } from '../services/compare';
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
    let locations = sortArrayByProperty(fetchedLocations, 'name', {
      type: 'string',
      direction: 1,
    });
    const getOneElement = (el) => locations.find((f) => el == f.id).name;
    const turnTemplates = fetchedTurnTemplates.map((turn) => {
      const position = fetchedPositions.find((f) => turn.positionId == f.id);
      const locationsMod = turn?.locationId?.map(getOneElement);
      return {
        ...turn,
        positionName: position?.name,
        locationsName: locationsMod,
      };
    });
    this.turnTemplates = turnTemplates;
  },
};
</script>

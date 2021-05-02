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
                    Location Name
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Schedule
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Full Address
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
                <tr v-for="(location, idx) in locations" :key="idx">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ location.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{
                      `Opens at: ${location.startTime} hrs. - Closes at: ${location.endTime} hrs.`
                    }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ getFullAddress(location) }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-full"
                  >
                    <ol
                      v-for="({ fullName, employeeId }, idx) in location.users"
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
import { compareUsers } from '../services/compare';
export default {
  data() {
    return {
      title: 'Sucursales',
      locations: [],
      users: [],
      defImg:
        'https://www.gravatar.com/avatar/3c58cbad936e4dbd5350510cf27146b2?d=mp&s=200',
    };
  },
  methods: {
    functionToLog: function () {
      console.log('sa');
    },
    getFullAddress: (location) => {
      return [
        location.address1,
        location.address2,
        location.commune,
        location.region,
      ]
        .filter((str) => str)
        .join(', ');
    },
  },
  async mounted() {
    const fetchedUsers = await fetchDataAsync('http://localhost:3004/users');
    const fetchedLocations = await fetchDataAsync(
      'http://localhost:3004/locations'
    );
    this.users = fetchedUsers.sort(compareUsers);
    let locations = fetchedLocations.map((location) => {
      const users = this.users
        .filter((user) => {
          const userLocationId = user.locationId[0]; //.shift();
          return location.id == userLocationId;
        })
        .map((u) => {
          const { firstName, lastName, employeeId } = u;
          return {
            fullName: `${firstName} ${lastName}`,
            employeeId,
          };
        });
      return {
        ...location,
        users,
      };
    });
    this.locations = locations;
  },
};
</script>

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
                    Full Name
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Location
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Legal Max Weekly Hours
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(user, idx) in users" :key="idx">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img
                          name="user.firstName"
                          class="h-10 w-10 rounded-full"
                          :src="user.avatarUrl || defImg"
                          alt="user.firstName"
                        />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ `${user.firstName} ${user.lastName}` }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ user.email }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ user.positionName }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ user.locationName }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span> {{ user.contractHours || 0 }} hours </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                    >
                      {{ user.isActive ? 'Activo' : 'Inactivo' }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ user.employeeId }}
                    </div>
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
      title: 'Vista de Usuarios',
      users: [],
      defImg:
        'https://www.gravatar.com/avatar/3c58cbad936e4dbd5350510cf27146b2?d=mp&s=200',
    };
  },
  methods: {
    functionToLog: function () {
      console.log('sa');
    },
  },
  async mounted() {
    const fetchedUsers = await fetchDataAsync('http://localhost:3004/users');
    const fetchedPositions = await fetchDataAsync(
      'http://localhost:3004/positions'
    );
    const fetchedLocations = await fetchDataAsync(
      'http://localhost:3004/locations'
    );
    const fetchedContracts = await fetchDataAsync(
      'http://localhost:3004/contracts'
    );
    let users = fetchedUsers.map((user) => {
      const position = fetchedPositions.find(
        (p) => p.id == user.positionId[0] && p.name
      );
      const location = fetchedLocations.find(
        (l) => l.id == user.locationId[0] && l.name
      );
      const contract = fetchedContracts.find(
        (c) => c.id == user.contract && c.legalMaxWeeklyHours
      );
      return {
        ...user,
        positionName: position.name,
        locationName: location.name,
        contractHours: contract.legalMaxWeeklyHours,
      };
    });
    users = sortArrayByProperty(fetchedUsers, 'employeeId', 'string', 1); // users.sort(compareUsers);
    this.users = users;
  },
};
</script>

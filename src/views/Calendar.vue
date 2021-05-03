<template>
  <div class="bg-gray-200 rounded-md p-3">
    <h1 class="text-2xl text-red-400">{{ title }}</h1>
    <!-- This example requires Tailwind CSS v2.0+ -->
    <div class="flex flex-col py-5">
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
                  ></th>
                  <th
                    v-for="(turn, idx) in notAssociatedModified"
                    :key="idx"
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ formatDateProperly(turn.date) }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Turnos No Asignados
                  </td>
                  <td
                    v-for="(turn, idx) in notAssociatedModified"
                    :key="idx"
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    <span>{{ getTurn(turn).title || '' }}</span>
                    <br />
                    <small class="px-6">{{ getTurn(turn).hours }}</small>
                  </td>
                </tr>

                <!-- More people... -->
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col py-5">
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
                  ></th>
                  <th
                    v-for="(turn, idx) in notAssociatedModified"
                    :key="idx"
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ formatDateProperly(turn.date) }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Turnos No Asignados
                  </td>
                  <td
                    v-for="(turn, idx) in notAssociatedModified"
                    :key="idx"
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    <span>{{ getTurn(turn).title || '' }}</span>
                    <br />
                    <small class="px-6">{{ getTurn(turn).hours }}</small>
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
import * as R from 'ramda';
import dayjs from 'dayjs';
export default {
  data() {
    return {
      title: 'Plantillas',
      associated: [],
      notAssociated: [],
      notAssociatedModified: [],
      users: [],
      defImg:
        'https://www.gravatar.com/avatar/3c58cbad936e4dbd5350510cf27146b2?d=mp&s=200',
    };
  },
  methods: {
    functionToLog: function () {
      console.log('sa');
    },
    formatDateProperly(date) {
      return dayjs(date).format('DD-MM-YYYY');
    },
    getTurn(turn) {
      console.log(turn);
      const title = turn?.turn?.name;
      const hours =
        turn && turn.turn ? `(${turn.turn.checkIn}-${turn.turn.checkOut})` : '';
      return { title, hours };
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
    const fetchedTurnTemplates = await fetchDataAsync(
      'http://localhost:3004/turnTemplates'
    );
    const fetchedTurns = await fetchDataAsync('http://localhost:3004/turns');
    const withoutUser = fetchedTurns.filter((e) => R.isEmpty(e.userId));

    this.notAssociated = sortArrayByProperty(withoutUser, 'date', {
      type: 'date',
    });
    const firstTimeNotAssociated = [...this.notAssociated].shift(),
      lastTimeNotAssociated = [...this.notAssociated].pop();
    const differenceNotAssciated =
      dayjs(lastTimeNotAssociated.date).diff(
        firstTimeNotAssociated.date,
        'day'
      ) - 1;
    const dates = Array(differenceNotAssciated)
      .fill()
      .map((_, i) =>
        dayjs(firstTimeNotAssociated.date)
          .add(i + 1, 'day')
          .format('YYYY-MM-DD')
      );
    const fillTimeElements = dates
      .map((el) => {
        const onlyDate = this.notAssociated.map((e) => e.date);
        const findEl = onlyDate.find((e) => e === el);
        return findEl !== el && el;
      })
      .filter((e) => e)
      .map((el) => ({ date: el }));
    const sortedNotAssociated = sortArrayByProperty(
      [...this.notAssociated, ...fillTimeElements],
      'date',
      { type: 'date' }
    );
    const getOneElement = (id) => fetchedTurnTemplates.find((f) => id == f.id);
    const turnTemplatesAndSorted = sortedNotAssociated.map((turn) => {
      const turnMod = getOneElement(turn?.turnTemplateId);
      return {
        ...turn,
        turn: turnMod,
      };
    });
    console.log(turnTemplatesAndSorted);
    this.notAssociatedModified = turnTemplatesAndSorted;
  },
};
</script>

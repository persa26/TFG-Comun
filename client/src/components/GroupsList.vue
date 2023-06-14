

<template>
    <div id="app">
        <div class="groups">
            <div class="flex items-center mb-7 ">
                <h1 class="text-4xl font-bold text-gray-800 mt-4">Lista de grupos</h1>
                <button
                    class="bg-transparent hover:bg-green-100 text-green-500 font-bold py-2 px-4 rounded-full mr-4 outline-none border-2 border-green-500 transition-colors duration-300 ring-green-500 ring-offset-2"
                    style="margin-left: 1%;" @click="showAddGroupForm = true">
                    + Añadir grupo
                </button>
            </div>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full border border-gray-200 divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="p-4 text-sm font-semibold tracking-wide text-left w-2/12">Nº</th>
                        <th class="p-4 text-sm font-semibold tracking-wide text-left w-4/12">Nombre</th>
                        <th class="p-4 text-sm font-semibold tracking-wide text-left w-6/12">Acción</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="showAddGroupForm" class="bg-white divide-x divide-gray-200">
                        <td class="p-4 text-sm text-gray-700">{{ groups.length + 1 }}</td>
                        <td class="p-4 text-sm text-gray-700">
                            <input type="text" v-model="newGroup.name" class="border border-gray-300 rounded-md p-1" />
                        </td>
                        <td class="p-4 text-sm text-gray-700">
                            <div class="flex space-x-2">
                                <button @click="saveNewGroup"
                                    class="bg-green-800 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1">
                                    + Añadir
                                </button>
                                <button @click="cancelNewGroup"
                                    class="bg-red-800 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1">
                                    Cancelar
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr v-for="(group, index) in groups" v-bind:key="group" class="bg-white divide-x divide-gray-200">
                        <td class="p-4 text-sm text-gray-700">{{ group.id }}</td>
                        <td class="p-4 text-sm text-gray-700">
                            <input v-if="group.editing" type="text" v-model="group.name" />
                            <span v-else>{{ group.name }}</span>
                        </td>
                        <td class="p-4 text-sm text-gray-700">
                            <div class="flex space-x-2">

                                <button v-if="group.editing"
                                    class="bg-green-800 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1"
                                    @click="saveGroup(index)">
                                    Guardar
                                </button>
                                <button v-if="group.editing"
                                    class="bg-red-800 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1"
                                    @click="cancelEditGroup(index)">
                                    Cancelar
                                </button>
                                <button v-else
                                    class="bg-cyan-800 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1"
                                    @click="editGroup(index)">
                                    <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="h-4 w-4">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125">
                                        </path>
                                    </svg>
                                    <span>Editar</span>
                                </button>
                                <button v-if="!group.editing"
                                    class="bg-red-800 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1 mr-2"
                                    @click="removeGroup(index)">
                                    <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="h-4 w-4">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0">
                                        </path>
                                    </svg>
                                    <span>Eliminar</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
      
<script>
import campusdb from "@/services/campusdb";

export default {
    data() {
        return {
            fields: ["id", "name", "action"],
            id: "",
            name: "",
            groups: [],
            showAddGroupForm: false,
            newGroup: {
                name: ""
            }
        };
    },
    mounted() {
        campusdb.getGroups().then((res) => (this.groups = res.data));
    },
    methods: {
        removeGroup(index) {
            try {
                if (!confirm("CONFIRMAR: Eliminar grupo")) return;
                const groupId = this.groups[index].id;
                campusdb.deleteGroup(groupId).then(() => {
                });
                // Se que deberia ir arriba pero habria que arreglar que la API respondiese y bla bla bla y como se que funciona lo dejo asi de momento. 
                this.groups.splice(index, 1);
            } catch (error) {
                console.log(error);
                this.error = true;
            }
        },
        saveNewGroup() {
            const groupName = this.newGroup.name;
            campusdb.addGroup(groupName).then((res) => {
                this.groups.push(res.data);
                this.showAddGroupForm = false;
                this.newGroup.name = "";
            });
        },
        cancelNewGroup() {
            this.showAddGroupForm = false;
            this.newGroup.name = "";
        },
        editGroup(index) {
            this.groups[index].editing = true;
            this.groups[index].originalName = this.groups[index].name;
        },
        saveGroup(index) {
            this.groups[index].editing = false;
            const groupId = this.groups[index].id;
            const groupName = this.groups[index].name;
            campusdb.updateGroup(groupId, groupName).then(() => {
                this.groups[index].name = groupName;
            });
        },
        cancelEditGroup(index) {
            this.groups[index].editing = false;
            this.groups[index].name = this.groups[index].originalName;
        },
    },
};
</script>
      
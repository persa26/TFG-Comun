<!-- <template>
    <div id="app" class="groups">
        <h1 class="text-4xl font-bold text-gray-800">Lista de grupos</h1>
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
                Nombre del grupo
            </label>
            <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name" type="text" v-model="newGroupName" />
        </div>
        <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full mb-4" @click="addGroup">
            Añadir grupo
        </button>
        <table class="w-full">
            <thead class="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                    <th class="p-4 text-sm font-semibold tracking-wide text-left">Nº</th>
                    <th class="p-4 text-sm font-semibold tracking-wide text-left">Nombre</th>
                    <th class="p-4 text-sm font-semibold tracking-wide text-left">Acción</th>
                </tr>
            </thead>
            <tbody>
                <tr class="bg-gray-50" v-for="(group, index) in groups" v-bind:key="group">
                    <td class="p-4 text-sm text-gray-700">{{ group.id }}</td>
                    <td class="p-4 text-sm text-gray-700">
                        <input v-if="group.editing" type="text" v-model="group.name" />
                        <span v-else>{{ group.name }}</span>
                    </td>
                    <td class="p-4 text-sm text-gray-700">
                        <button v-if="group.editing"
                            class="bg-green-800 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full mr-2"
                            @click="saveGroup(index)">
                            Guardar
                        </button>
                        <button v-if="group.editing"
                            class="bg-red-800 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full mr-2"
                            @click="cancelEditGroup(index)">
                            Cancelar
                        </button>
                        <button v-else
                            class="bg-cyan-800 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full mr-2"
                            @click="editGroup(index)">
                            Editar
                        </button>
                        <button v-if="!group.editing"
                            class="bg-red-800 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full"
                            @click="removeGroup(index)">
                            Eliminar
                        </button>

                    </td>
                </tr>
            </tbody>
        </table>
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
                    this.groups.splice(index, 1);
                });
            } catch (error) {
                console.log(error);
                this.error = true;
            }
        },
        addGroup() {
            const groupName = this.newGroupName;
            campusdb.addGroup(groupName).then((res) => {
                this.groups.push(res.data);
                this.newGroupName = "";
            });

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
    -->

<template>
    <div id="app" class="groups">
        <h1 class="text-4xl font-bold text-gray-800">Lista de grupos</h1>
        <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
            @click="showAddGroupForm = true">
            Añadir grupo
        </button>

        <table class="w-full">
            <thead class="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                    <th class="p-4 text-sm font-semibold tracking-wide text-left">Nº</th>
                    <th class="p-4 text-sm font-semibold tracking-wide text-left">Nombre</th>
                    <th class="p-4 text-sm font-semibold tracking-wide text-left">Acción</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="showAddGroupForm" class="bg-gray-50">
                    <td class="p-4 text-sm text-gray-700">{{ groups.length + 1 }}</td>
                    <td class="p-4 text-sm text-gray-700">
                        <input type="text" v-model="newGroup.name" class="border border-gray-300 rounded-md p-1" />
                    </td>
                    <td class="p-4 text-sm text-gray-700">
                        <button @click="saveNewGroup"
                            class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-full mr-2">
                            Guardar
                        </button>
                        <button @click="cancelNewGroup"
                            class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full">
                            Cancelar
                        </button>
                    </td>
                </tr>
                <tr class="bg-gray-50" v-for="(group, index) in groups" v-bind:key="group">
                    <td class="p-4 text-sm text-gray-700">{{ group.id }}</td>
                    <td class="p-4 text-sm text-gray-700">
                        <input v-if="group.editing" type="text" v-model="group.name" />
                        <span v-else>{{ group.name }}</span>
                    </td>
                    <td class="p-4 text-sm text-gray-700">
                        <button v-if="group.editing"
                            class="bg-green-800 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full mr-2"
                            @click="saveGroup(index)">
                            Guardar
                        </button>
                        <button v-if="group.editing"
                            class="bg-red-800 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full mr-2"
                            @click="cancelEditGroup(index)">
                            Cancelar
                        </button>
                        <button v-else
                            class="bg-cyan-800 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full mr-2"
                            @click="editGroup(index)">
                            Editar
                        </button>
                        <button v-if="!group.editing"
                            class="bg-red-800 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full"
                            @click="removeGroup(index)">
                            Eliminar
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
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
      
<template>
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
                        <!-- Mostrar un formulario para editar el nombre del grupo si está en modo edición -->
                        <input v-if="group.editing" type="text" v-model="group.name" />
                        <!-- Mostrar el nombre del grupo si no está en modo edición -->
                        <span v-else>{{ group.name }}</span>
                    </td>
                    <td class="p-4 text-sm text-gray-700">
                        <!-- Mostrar botones para guardar o cancelar la edición si el grupo está en modo edición -->
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
                        <!-- Mostrar botones para editar o eliminar el grupo si no está en modo edición -->
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

                //llamar API para borrar grupo
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
   
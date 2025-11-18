<template>
  <div class="q-pa-md">

    <q-btn color="primary" label="Adicionar Item" @click="openAdd" />
<div class="row q-col-gutter-md q-mt-md">

  <div class="col-12 col-sm-4">
    <q-input v-model="filterId" label="Filtrar por ID" type="number" filled clearable />
  </div>

  <div class="col-12 col-sm-4">
    <q-input v-model="filterNome" label="Filtrar por Nome" filled clearable />
  </div>

  <div class="col-12 col-sm-4">
    <q-input v-model="filterQuantidade" label="Filtrar por Quantidade" type="number" filled clearable />
  </div>

</div>
  <div class="row q-mt-md text-subtitle1">

  <div class="col-12 col-sm-6">
    <strong>Total de produtos:</strong> {{ totalProdutos }}
  </div>

  <div class="col-12 col-sm-6">
    <strong>Soma das quantidades:</strong> {{ totalQuantidade }}
  </div>

</div>
    <q-table
      class="q-mt-md"
      title="Lista de Produtos"
      :columns="columns"
      :rows="filteredRows"
      row-key="id"
    >
  
      <template #body-cell-acoes="props">
        <q-td>
          <q-btn dense icon="edit" color="primary" flat @click="openEdit(props.row)" />
          <q-btn dense icon="delete" color="negative" flat @click="confirmDelete(props.row)" />
        </q-td>
      </template>
    </q-table>

    <!-- Modal criar/editar -->
    <q-dialog v-model="dialog">
      <q-card style="min-width: 300px;">
        
        <q-card-section>
          <div class="text-h6">{{ isEditing ? 'Editar Item' : 'Adicionar Item' }}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="saveItem">
            <q-input v-model="form.nome" label="Nome" filled required />

            <q-input
              v-model.number="form.quantidade"
              label="Quantidade"
              type="number"
              filled
              required
            />

            <div class="row justify-end q-gutter-sm q-mt-md">
              <q-btn label="Cancelar" flat v-close-popup />
              <q-btn label="Salvar" color="primary" type="submit" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Dialogo de confirmação -->
    <q-dialog v-model="confirmDialog">
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="warning" color="warning" size="38px" />
          <div class="q-ml-sm">
            Deseja excluir <strong>{{ selected?.nome }}</strong>?
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat label="Excluir" color="negative" @click="deleteItem" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script setup>
import { ref, computed} from 'vue'
import { Notify } from 'quasar'

const filterId = ref('')
const filterNome = ref('')
const filterQuantidade = ref('')
const filteredRows = computed(() => {
  return rows.value.filter(item => {
    
    // Filtrar ID
    if (filterId.value && item.id !== Number(filterId.value)) {
      return false
    }

    // Filtrar Nome
    if (
      filterNome.value &&
      !item.nome.toLowerCase().includes(filterNome.value.toLowerCase())
    ) {
      return false
    }

    // Filtrar Quantidade
    if (
      filterQuantidade.value &&
      item.quantidade !== Number(filterQuantidade.value)
    ) {
      return false
    }

    return true
  })
})
const totalProdutos = computed(() => filteredRows.value.length)

const totalQuantidade = computed(() => {
  return filteredRows.value.reduce((sum, item) => sum + item.quantidade, 0)
})

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'quantidade', label: 'Quantidade', field: 'quantidade', align: 'right', sortable: true },
  { name: 'acoes', label: 'Ações', align: 'center' }
]

const rows = ref([
  { id: 1, nome: 'Banana', quantidade: 5 },
  { id: 2, nome: 'Pão', quantidade: 6 },
  { id: 3, nome: 'Frango', quantidade: 1 },
  { id: 4, nome: 'Detergente', quantidade: 2 }
])

const dialog = ref(false)
const confirmDialog = ref(false)
const isEditing = ref(false)

const selected = ref(null)

const form = ref({
  id: null,
  nome: '',
  quantidade: 0
})

function openAdd() {
  isEditing.value = false
  form.value = { id: null, nome: '', quantidade: 0 }
  dialog.value = true
}

function openEdit(row) {
  isEditing.value = true
  form.value = { ...row }
  dialog.value = true
}

function saveItem() {
  const nome = form.value.nome.trim().toLowerCase()

  // Verifica duplicidade (ignorando o item atual quando em edição)
  const existe = rows.value.some(
    r => r.nome.trim().toLowerCase() === nome && r.id !== form.value.id
  )

  if (existe) {
    Notify.create({
      type: 'negative',
      message: 'Já existe um produto com este nome!'
    })
    return
  }

  // Editando
  if (isEditing.value) {
    const i = rows.value.findIndex(r => r.id === form.value.id)
    if (i !== -1) rows.value[i] = { ...form.value }
  }
  // Criando novo
  else {
    const newId = rows.value.length ? Math.max(...rows.value.map(r => r.id)) + 1 : 1
    rows.value.push({ id: newId, ...form.value })
  }

  dialog.value = false
}

function confirmDelete(row) {
  selected.value = row
  confirmDialog.value = true
}

function deleteItem() {
  rows.value = rows.value.filter(r => r.id !== selected.value.id)
  confirmDialog.value = false
  selected.value = null
}
</script>
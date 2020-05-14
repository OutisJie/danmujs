import { createStore } from 'my_module/east-store'

const exampleStore = createStore({
  name: 'exampleStore',
  loading: false,
  tableData: {
    list: [] as any[],
    current: 1,
    pageSize: 20,
    total: 0,
  },
}, {
  fetchData: (param, cb?) => (state) => {
    console.log('fetch action', param)
    // setTimeout(() => {
    // state.loading = true
    state.tableData = {
      list: [1, 2, 3],
      current: 1,
      pageSize: 20,
      total: 0,
    }
    cb && cb()
    // }, 500)
  },
})

export default exampleStore

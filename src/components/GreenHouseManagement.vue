<template>
  <div class="greenHouseManagementContainer fillContainer">
    <a-table :data-source="greenHouseList" rowKey="id" :pagination="false">
      <a-table-column key="id" title="大棚编号" data-index="id"/>
      <a-table-column key="name" title="大棚名称" data-index="name"/>
      <a-table-column key="location" title="所属基地" data-index="name">
        <template slot-scope="text,row">
          {{ row.location ? row.location.name : '无' }}
        </template>
      </a-table-column>
      <a-table-column key="action" title="操作">
        <template slot-scope="text,row">
          <a @click="showUpdateModel(row)">更新</a>
          <a-divider type="vertical"/>
          <a-popconfirm
            :title="`是否要删除设备${row.name}?`"
            ok-text="是"
            cancel-text="否"
            @confirm="deleteGreenHouse(row.id)"
          >
            <a>删除</a>
          </a-popconfirm>
        </template>
      </a-table-column>
    </a-table>
    <a-row style="position: absolute;bottom: 20px;width: 100%">
      <a-col :offset="1" :span="2" style="margin-bottom: 5px">
        <a-button type="primary" @click="showAddModel">添加大棚</a-button>
      </a-col>
      <a-col :span="10" :offset="11">
        <a-pagination :current="pagination.currentPage" :total="pagination.total"
                      :pageSize="pagination.pageSize" @change="nextPage" v-if="pagination.pages>1"/>
      </a-col>
    </a-row>
    <a-modal v-model="modelVisible" :title="isAddModel?'添加大棚':'更新大棚'" mask :maskClosable="false"
             :okText="isAddModel?'添加':'更新'"
             cancelText="取消"
             @ok="modelSubmitForm"
             @cancel="modelCancel"

    >
      <a-form-model ref="modelForm" :model="modelForm" :rules="isAddModel?modelFormRules:{}">
        <a-form-model-item prop="name">
          <a-input v-model="modelForm.name" type="text"
                   :placeholder="isAddModel?'Name':this.updateInfo.name"/>
        </a-form-model-item>
        <a-form-model-item prop="locationId">
          <a-select v-model="modelForm.locationId" placeholder="请选择您的基地">
            <a-select-option v-for="item in locationList" :value="item.id" :key="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "GreenHouseManagement",
  data() {
    return {
      modelFormRules: {
        name: [
          {required: true, message: '大棚的名称不可以为空', trigger: 'blur'},
          {min: 3, max: 7, message: '大棚的名称长度为3到7', trigger: 'blur'},
        ],
        locationId: [
          {required: true, message: '基地不可以为空', trigger: 'blur'}
        ]
      },
      locationList: [],
      updateInfo: {},
      modelForm: {},
      modelVisible: false,
      isAddModel: true,
      greenHouseList: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pages: 0
      },
    }
  },
  methods: {
    deleteGreenHouse(greenHouseId) {
      this.$http.get(`/greenHouse/delete/${greenHouseId}`).then(response => {
        if (response.data.status === 2000) {
          this.$message.info('删除成功')
          this.getGreenHouseList(this.pagination.currentPage, this.pagination.pageSize)
        }
      }, error => {
      })
    },
    showUpdateModel(row) {
      this.getLocationList()
      this.modelVisible = true
      this.isAddModel = false
      if (row.location) {
        this.modelForm.locationId = row.location.id
      }
      this.modelForm.id = row.id
      this.updateInfo.name = row.name
    },
    showAddModel() {
      this.getLocationList()
      this.modelVisible = true
      this.isAddModel = true
    },
    modelSubmitForm() {
      if (this.isAddModel) {
        this.$refs.modelForm.validate().then(res => {
          this.$http.post('/greenHouse/add', this.modelForm).then(response => {
            if (response.data.status === 2000) {
              this.$message.info('添加成功')
              this.modelCancel()
              this.getGreenHouseList(this.pagination.currentPage, this.pagination.pageSize)
              this.modelVisible = false
            }
          }, error => {
          })
        }, err => {

        })
      } else {
        this.$http.post('/greenHouse/update', this.modelForm).then(response => {
          if (response.data.status === 2000) {
            this.$message.info('修改成功')
            this.modelCancel()
            this.getGreenHouseList(this.pagination.currentPage, this.pagination.pageSize)
            this.modelVisible = false
          }
        }, error => {
        })
      }
    },
    modelCancel() {
      this.modelForm = {}
      this.$refs.modelForm.resetFields()
    },
    getGreenHouseList(page, size) {
      this.$http.get(`/greenHouse/getAllHasLocation/${page}/${size}`).then(response => {
        this.greenHouseList = response.data.data.pageInfo.list
        this.pagination.total = response.data.data.pageInfo.total
        this.pagination.currentPage = response.data.data.pageInfo.pageNum
        this.pagination.pageSize = response.data.data.pageInfo.pageSize
        this.pagination.pages = response.data.data.pageInfo.pages
      }, error => {
      })
    },
    getLocationList() {
      this.$http.get('/location/getAll').then(response => {
        this.locationList = response.data.data.locationList
      }, error => {
      })
    },
    nextPage(page, pageSize) {
      this.getGreenHouseList(page, pageSize)
    },
  },
  mounted() {
    this.getGreenHouseList(this.pagination.currentPage, this.pagination.pageSize)
  }
}
</script>

<style scoped>
.greenHouseManagementContainer {
  position: relative;
}
</style>

<template>
  <div class="locationManagementContainer fillContainer">
    <a-table :data-source="locationList" rowKey="id" :pagination="false">
      <a-table-column key="id" title="基地编号" data-index="id"/>
      <a-table-column key="name" title="基地名称" data-index="name"/>
      <a-table-column key="latitude" title="经度">
        <template slot-scope="text,row">
          {{ row.latitude ? row.latitude : '无' }}
        </template>
      </a-table-column>
      <a-table-column key="longitude" title="维度">
        <template slot-scope="text,row">
          {{ row.longitude ? row.longitude : '无' }}
        </template>
      </a-table-column>
      <a-table-column key="action" title="操作">
        <template slot-scope="text,row">
          <a @click="showUpdateModel(row)">更新</a>
          <a-divider type="vertical"/>
          <a-popconfirm
            :title="`是否要删除${row.name}?`"
            ok-text="是"
            cancel-text="否"
            @confirm="deleteLocation(row.id)"
          >
            <a>删除</a>
          </a-popconfirm>
        </template>
      </a-table-column>
    </a-table>
    <a-row style="position: absolute;bottom: 20px;width: 100%">
      <a-col :offset="1" :span="2" style="margin-bottom: 5px">
        <a-button type="primary" @click="showAddModel">添加基地</a-button>
      </a-col>
      <a-col :span="10" :offset="11">
        <a-pagination :current="pagination.currentPage" :total="pagination.total"
                      :pageSize="pagination.pageSize" @change="nextPage" v-if="pagination.pages>1"/>
      </a-col>
    </a-row>
    <a-modal v-model="modelVisible" :title="isAddModel?'添加基地':'更新基地'" mask :maskClosable="false"
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

        <a-form-model-item prop="latitude">
          <a-input v-model="modelForm.latitude" type="text"
                   :placeholder="isAddModel?'精度':this.updateInfo.latitude"/>
        </a-form-model-item>

        <a-form-model-item prop="longitude">
          <a-input v-model="modelForm.longitude" type="text"
                   :placeholder="isAddModel?'维度':this.updateInfo.longitude"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "LocationManagement",
  data() {
    return {
      modelFormRules: {
        name: [
          {required: true, message: '基地的名称不可以为空', trigger: 'blur'},
          {min: 3, max: 7, message: '基地的名称长度为3到7', trigger: 'blur'},
        ],
        latitude: [
          {required: true, message: '基地的名称不可以为空', trigger: 'blur'}
        ],
        longitude: [
          {required: true, message: '基地的名称不可以为空', trigger: 'blur'}
        ]
      },
      locationList: [],
      updateInfo: {},
      modelForm: {},
      modelVisible: false,
      isAddModel: true,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pages: 0
      },
    }
  },
  methods: {
    deleteLocation(greenHouseId) {
      this.$http.get(`/location/delete/${greenHouseId}`).then(response => {
        if (response.data.status === 2000) {
          this.$message.info('删除成功')
          this.getLocationList(this.pagination.currentPage, this.pagination.pageSize)
        }
      }, error => {
      })
    },
    showUpdateModel(row) {
      this.modelVisible = true
      this.isAddModel = false
      this.modelForm.id = row.id
      this.updateInfo.name = row.name
      if (row.latitude !== undefined) {
        this.updateInfo.latitude = row.latitude
      }
      if (row.longitude !== undefined) {
        this.updateInfo.longitude = row.longitude
      }
    },
    showAddModel() {
      this.modelVisible = true
      this.isAddModel = true
    },
    modelSubmitForm() {
      if (this.isAddModel) {
        this.$refs.modelForm.validate().then(res => {
          this.$http.post('/location/add', this.modelForm).then(response => {
            if (response.data.status === 2000) {
              this.$message.info('添加成功')
              this.modelCancel()
              this.getLocationList(this.pagination.currentPage, this.pagination.pageSize)
              this.modelVisible = false
            }
          }, error => {
          })
        }, err => {

        })
      } else {
        this.$http.post('/location/update', this.modelForm).then(response => {
          if (response.data.status === 2000) {
            this.$message.info('修改成功')
            this.modelCancel()
            this.getLocationList(this.pagination.currentPage, this.pagination.pageSize)
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
    getLocationList(page, size) {
      this.$http.get(`/location/getAll/${page}/${size}`).then(response => {
        this.locationList = response.data.data.pageInfo.list
        this.pagination.total = response.data.data.pageInfo.total
        this.pagination.currentPage = response.data.data.pageInfo.pageNum
        this.pagination.pageSize = response.data.data.pageInfo.pageSize
        this.pagination.pages = response.data.data.pageInfo.pages
      }, error => {
      })
    },
    nextPage(page, pageSize) {
      this.getLocationList(page, pageSize)
    },
  },
  mounted() {
    this.getLocationList(this.pagination.currentPage, this.pagination.pageSize)
  }
}
</script>

<style scoped>
.locationManagementContainer {
  position: relative;
}
</style>

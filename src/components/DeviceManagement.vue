<template>
  <div class="deviceManagementContainer fillContainer">
    <a-table :data-source="deviceList" rowKey="id" :pagination="false">
      <a-table-column key="id" title="设备编号" data-index="id"/>
      <a-table-column key="name" title="设备名称" data-index="name"/>
      <a-table-column key="deviceId" title="设备唯一标识" data-index="deviceId"/>
      <a-table-column key="greenHouse" title="所属大棚" data-index="name">
        <template slot-scope="text,row">
          {{ row.greenHouse ? row.greenHouse.name : '无' }}
        </template>
      </a-table-column>
      <a-table-column key="action" title="操作">
        <template slot-scope="text,row">
          <span>
          <a @click="showUpdateModel(row)">更新</a>
          <a-divider type="vertical"/>
             <a-popconfirm
               :title="`是否要删除设备${row.name}?`"
               ok-text="是"
               cancel-text="否"
               @confirm="deleteDevice(row.id)"
             >
          <a>删除</a>
          </a-popconfirm>
          </span>
        </template>
      </a-table-column>
    </a-table>
    <a-row style="position: absolute;bottom: 20px;width: 100%">
      <a-col :offset="1" :span="2" style="margin-bottom: 5px">
        <a-button type="primary" @click="showAddModel">添加设备</a-button>
      </a-col>
      <a-col :span="10" :offset="11">
        <a-pagination :current="deviceListPagination.currentPage" :total="deviceListPagination.total"
                      :pageSize="deviceListPagination.pageSize" @change="nextPage" v-if="deviceListPagination.pages>1"/>
      </a-col>
    </a-row>

    <a-modal v-model="modelVisible" :title="isAddModel?'添加设备':'更新设备'" mask :maskClosable="false"
             :okText="isAddModel?'添加':'更新'"
             cancelText="取消"
             @ok="modelSubmitForm"
             @cancel="modelCancel"

    >
      <a-form-model ref="modelForm" :model="modelForm" :rules="isAddModel?modelFormRules:[]">
        <a-form-model-item prop="name">
          <a-input v-model="modelForm.name" type="text"
                   :placeholder="isAddModel?'设备名称':this.updateDeviceInfo.name"/>
        </a-form-model-item>
        <a-form-model-item prop="deviceId">
          <a-input v-model="modelForm.deviceId" type="text"
                   :placeholder="isAddModel?'设备唯一Id':this.updateDeviceInfo.deviceId"/>
        </a-form-model-item>
        <a-form-model-item prop="greenHouseId">
          <a-select v-model="modelForm.greenHouseId" placeholder="请选择您的大棚">
            <a-select-option v-for="item in greenHouseList" :value="item.id" :key="item.id">
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
  name: "DeviceManagement",
  data() {
    return {
      greenHouseList: [],
      updateDeviceInfo: {},
      modelForm: {},
      modelVisible: false,
      isAddModel: true,
      deviceList: [],
      deviceListPagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pages: 0
      },
      modelFormRules: {
        name: [
          {required: true, message: '设备名称不可以为空', trigger: 'blur'},
          {min: 3, max: 7, message: '设备的名称长度为3到7', trigger: 'blur'},
        ],
        deviceId: [
          {required: true, message: '设备标识id不可以为空', trigger: 'blur'}
        ],
        greenHouseId: [
          {required: true, message: '大棚不可以为空', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    showAddModel() {
      this.getGreenHouseList()
      this.modelVisible = true
      this.isAddModel = true
    },
    showUpdateModel(row) {
      this.getGreenHouseList()
      this.modelForm.id = row.id
      this.updateDeviceInfo.name = row.name
      this.updateDeviceInfo.deviceId = row.deviceId
      if (row.greenHouse) {
        this.modelForm.greenHouseId = row.greenHouse.id
      }
      this.modelVisible = true
      this.isAddModel = false
    },
    getGreenHouseList() {
      this.$http.get('/greenHouse/getAll').then(response => {
        this.greenHouseList = response.data.data.greenHouseList
      }, reason => {

      })
    },
    modelCancel() {
      this.modelForm = {}
      this.$refs.modelForm.resetFields()
    },
    modelSubmitForm() {
      if (this.isAddModel) {
        this.$refs.modelForm.validate().then(res => {
          this.$http.post('/device/add', this.modelForm).then(response => {
            if (response.data.status === 2000) {
              this.$message.info('添加成功')
              this.modelCancel()
              this.getDeviceList(this.deviceListPagination.currentPage, this.deviceListPagination.pageSize)
              this.modelVisible = false
            }
          }, error => {
          })
        }, err => {

        })
      } else {
        this.$http.post('/device/update', this.modelForm).then(response => {
          if (response.data.status === 2000) {
            this.$message.info('修改成功')
            this.modelCancel()
            this.getDeviceList(this.deviceListPagination.currentPage, this.deviceListPagination.pageSize)
            this.modelVisible = false
          }
        }, error => {
        })
      }


    },
    getDeviceList(page, size) {
      this.$http.get(`/device/getAllHasGreenHouse/${page}/${size}`)
        .then(response => {
          if (response.data.status === 2000) {
            this.deviceList = response.data.data.pageInfo.list
            this.deviceListPagination.total = response.data.data.pageInfo.total
            this.deviceListPagination.currentPage = response.data.data.pageInfo.pageNum
            this.deviceListPagination.pageSize = response.data.data.pageInfo.pageSize
            this.deviceListPagination.pages = response.data.data.pageInfo.pages
          }
        }, reason => {

        })
    },
    nextPage(page, pageSize) {
      this.getDeviceList(page, pageSize)
    },
    deleteDevice(deviceId) {
      this.$http.get(`/device/delete/${deviceId}`).then(response => {
        if (response.data.status === 2000) {
          this.$message.info('删除成功')
          this.getDeviceList(this.deviceListPagination.currentPage, this.deviceListPagination.pageSize)
        }
      }, error => {
      })
    }
  },
  mounted() {
    this.getDeviceList(this.deviceListPagination.currentPage, this.deviceListPagination.pageSize)
  }
}
</script>

<style scoped>
.deviceManagementContainer {
  position: relative;
}
</style>

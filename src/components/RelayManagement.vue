<template>
  <div class="relayManagementContainer fillContainer">
    <a-table :data-source="relayList" rowKey="id" :pagination="false">
      <a-table-column key="id" title="继电器编号" data-index="id"/>
      <a-table-column key="name" title="继电器名称" data-index="name"/>
      <a-table-column key="identityId" title="唯一标识" data-index="identityId"/>
      <a-table-column key="deviceId" title="所属设备ID" data-index="deviceId"/>
      <a-table-column key="autoTrigger" title="自动触发" data-index="autoTrigger">
        <template slot-scope="text,row">
          <a-switch :default-checked="row.autoTrigger" @change="switchAutoTrigger" :data-id="row.id"></a-switch>
        </template>
      </a-table-column>
      <a-table-column key="type" title="触发类型" data-index="type">
        <template slot-scope="text,row">
          {{ row.type ? relayType[row.type] : relayType['0'] }}
        </template>
      </a-table-column>
      <a-table-column key="isOpen" title="开关状态" data-index="ipOpen">
        <template slot-scope="text,row">
          <a-switch :default-checked="row.isOpen" @change="switchRelay" :data-id="row.id"></a-switch>
        </template>
      </a-table-column>
      <a-table-column key="greenHouse" title="所属大棚" data-index="name">
        <template slot-scope="text,row">
          {{ row.greenHouse === undefined ? '无' : row.greenHouse.name }}
        </template>
      </a-table-column>
      <a-table-column key="action" title="操作">
        <template slot-scope="text,row">
          <a @click="showUpdateModel(row)">更新</a>
          <a-divider type="vertical"/>
          <a-popconfirm
            :title="`是否要删除继电器${row.name}?`"
            ok-text="是"
            cancel-text="否"
            @confirm="deleteRelay(row.id)"
          >
            <a>删除</a>
          </a-popconfirm>
        </template>
      </a-table-column>
    </a-table>
    <a-row style="position: absolute;bottom: 20px;width: 100%">
      <a-col :offset="1" :span="2" style="margin-bottom: 5px">
        <a-button type="primary" @click="showAddModel">添加继电器</a-button>
      </a-col>
      <a-col :span="10" :offset="11">
        <a-pagination :current="relayListPagination.currentPage" :total="relayListPagination.total"
                      :pageSize="relayListPagination.pageSize" @change="nextPage" v-if="relayListPagination.pages>1"/>
      </a-col>
    </a-row>
    <a-modal v-model="modelVisible" :title="isAddModel?'添加继电器':'更新继电器'" mask :maskClosable="false"
             :okText="isAddModel?'添加':'更新'"
             cancelText="取消"
             @ok="modelSubmitForm"
             @cancel="modelCancel"

    >
      <a-form-model ref="modelForm" :model="modelForm" :rules="isAddModel?modelFormRules:{}">
        <a-form-model-item prop="name">
          <a-input v-model="modelForm.name" type="text"
                   :placeholder="isAddModel?'继电器名称':updateRelay.name"/>
        </a-form-model-item>
        <a-form-model-item prop="identityId">
          <a-input v-model="modelForm.identityId" type="text"
                   :placeholder="isAddModel?'唯一标识':updateRelay.identityId"/>
        </a-form-model-item>
        <a-form-model-item prop="deviceId">
          <a-input v-model="modelForm.deviceId" type="text"
                   :placeholder="isAddModel?'所属设备':updateRelay.deviceId"/>
        </a-form-model-item>
        <a-form-model-item prop="type">
          <a-select v-model="modelForm.type" :placeholder="isAddModel?'触发类型':updateRelay.typeName">
            <a-select-option v-for="(item,index) in relayType" :value="index" :key="index">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item prop="greenHouseId">
          <a-select v-model="modelForm.greenHouseId" :placeholder="isAddModel?'所属大棚':updateRelay.greenHouseName">
            <a-select-option v-for="greenHouse in greenHouseList" :value="greenHouse.id" :key="greenHouse.id">
              {{ greenHouse.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "RelayManagement",
  data() {
    const relayType = ['无', '监控温度', '监控湿度', '监控光照度', '监控TVOC', '监控CO2', '监控大气压']
    return {
      updateRelay: {
        name: '',
        identityId: '',
        typeName: '',
        greenHouseName: '无',
        deviceId: ''
      },
      modelForm: {},
      modelVisible: false,
      isAddModel: true,
      relayList: [],
      relayListPagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pages: 0
      },
      relayType,
      greenHouseList: [],
      modelFormRules: {
        name: [
          {required: true, message: '继电器名称不可以为空', trigger: 'blur'}
        ],
        deviceId: [
          {required: true, message: '所属设备不可以为空', trigger: 'blur'}
        ],
        greenHouseId: [
          {required: true, message: '所属大棚不可以为空', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '触发类型不可以为空', trigger: 'blur'}
        ],
        identityId: [
          {required: true, message: '设备标识不可以为空', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    switchAutoTrigger(checked, event) {
      let relayId = event.target.dataset.id;
      this.$http.get(`/relay/switchAutoTrigger/${relayId}/${checked}`).then(response => {
        if (response.data.status === 2000) {
          this.$message.info("操作成功")
        }
      }, error => {
      })
    },
    switchRelay(checked, event) {
      let relayId = event.target.dataset.id;
      this.$http.get(`/relay/sendInstruction/${relayId}/${checked}`).then(response => {
        if (response.data.status === 2000) {
          this.$message.info("操作成功")
        }
      }, error => {
      })
    },
    deleteRelay(relayId) {
      this.$http.get(`/relay/delete/${relayId}`).then(response => {
        if (response.data.status === 2000) {
          this.$message.info("删除成功")
          this.getRelayList(this.relayListPagination.currentPage, this.relayListPagination.pageSize)
        }
      }, error => {
      })
    },
    getGreenHouseList() {
      this.$http.get('/greenHouse/getAll').then(response => {
        this.greenHouseList = response.data.data.greenHouseList
      }, error => {
      })
    },
    showAddModel() {
      this.isAddModel = true
      this.modelVisible = true
      this.getGreenHouseList()
    },
    showUpdateModel(row) {
      this.updateRelay.name = row.name
      this.updateRelay.identityId = row.identityId
      if (row.type) {
        this.updateRelay.typeName = this.relayType[row.type]
      } else {
        this.updateRelay.typeName = '无'
      }

      if (row.greenHouse !== undefined && row.greenHouse !== null && row.greenHouse !== '') {
        this.updateRelay.greenHouseName = row.greenHouse.name
      } else {
        this.updateRelay.greenHouseName = '无'
      }
      this.updateRelay.deviceId = row.deviceId
      this.isAddModel = false
      this.modelVisible = true
      this.modelForm.id = row.id
      this.getGreenHouseList()
    },
    modelSubmitForm() {
      if (this.isAddModel) {
        this.$refs.modelForm.validate().then(res => {
          this.$http.post('/relay/add', this.modelForm).then(response => {
            if (response.data.status === 2000) {
              this.$message.info('添加成功')
              this.modelCancel()
              this.getRelayList(this.relayListPagination.currentPage, this.relayListPagination.pageSize)
              this.modelVisible = false
            }
          }, error => {
          })
        }, err => {

        })
      } else {
        this.$http.post('/relay/update', this.modelForm).then(response => {
          if (response.data.status === 2000) {
            this.$message.info('修改成功')
            this.modelCancel()
            this.getRelayList(this.relayListPagination.currentPage, this.relayListPagination.pageSize)
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
    nextPage(page, pageSize) {
      this.getRelayList(page, pageSize)
    },
    getRelayList(page, size) {
      this.$http.get(`/relay/getAllHasGreenHouseByPage/${page}/${size}`).then(response => {
        this.relayList = response.data.data.pageInfo.list
        this.relayListPagination.total = response.data.data.pageInfo.total
        this.relayListPagination.currentPage = response.data.data.pageInfo.pageNum
        this.relayListPagination.pageSize = response.data.data.pageInfo.pageSize
        this.relayListPagination.pages = response.data.data.pageInfo.pages
      }, error => {
      })
    }
  },
  mounted() {
    this.getRelayList(this.relayListPagination.currentPage, this.relayListPagination.pageSize)
  }
}
</script>

<style scoped>
.relayManagementContainer {
  position: relative;
}
</style>

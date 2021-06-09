<template>
  <div class="userManagementContainer fillContainer">
    <a-table :data-source="userList" :pagination="false" size="middle" rowKey="id">
      <a-table-column key="id" title="编号" data-index="id" width="10%"/>
      <a-table-column key="username" title="用户名" data-index="username" width="15%"/>
      <a-table-column key="locationIdList" title="基地列表" data-index="locationIdList" width="30%">
        <template slot-scope="locationIdList,row">
          <a-select
            mode="multiple"
            :default-value="locationIdList"
            style="width: 400px"
            placeholder="没有基地"
            @select="selectLocation"
            @deselect="deSelectLocation"
          >
            <a-select-option v-for="i in locationList" :key="i.id" :data-userId="row.id">
              {{ i.name }}
            </a-select-option>
          </a-select>
        </template>
      </a-table-column>
      <a-table-column key="action" title="操作" width="20%">
        <template slot-scope="text, row">
        <span>
          <a @click="showUpdateModel(row.id,row.username)">更新</a>
          <a-divider type="vertical"/>
           <a-popconfirm
             :title="`是否要删除用户${row.username}?`"
             ok-text="是"
             cancel-text="否"
             @confirm="deleteUser(row.id)"
           >
          <a href="#" v-if="adminId!==row.id">删除</a>
  </a-popconfirm>
        </span>
        </template>
      </a-table-column>
    </a-table>
    <a-row style="position: absolute;bottom: 40px;width: 100%">
      <a-col :offset="1" :span="2" style="margin-bottom: 5px">
        <a-button type="primary" @click="showAddModel">添加用户</a-button>
      </a-col>
      <a-col :span="10" :offset="11" v-if="userListPagination.pages>1">
        <a-pagination :current="userListPagination.currentPage" :total="userListPagination.total"
                      :pageSize="userListPagination.pageSize" @change="nextPage"/>
      </a-col>
    </a-row>

    <a-modal v-model="modelVisible" :title="isAddUserModel?'添加用户':'更新用户'" mask :maskClosable="false"
             :okText="isAddUserModel?'添加':'更新'"
             cancelText="取消"
             @ok="modelSubmitForm"
             @cancel="modelCancel">
      <a-form-model ref="modelForm" :model="modelForm" :rules="modelFormRules">
        <a-form-model-item prop="username">
          <a-input v-model="modelForm.username" type="text"
                   :placeholder="isAddUserModel?'Username':this.updateUsername"/>
        </a-form-model-item>
        <a-form-model-item prop="password">
          <a-input v-model="modelForm.password" type="password" placeholder="Password"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "UserManagement",
  props: {
    adminId: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      updateUserId: '',
      isAddUserModel: true,
      modelVisible: false,
      userList: [],
      locationList: [],
      userListPagination: {
        currentPage: 1,
        pageSize: 8,
        total: 0,
        pages: 0
      },
      modelForm: {},
      modelFormRules: {
        username: [
          {required: true, message: '用户名不可以为空', trigger: 'blur'},
          {validator: this.checkUsername, trigger: 'blur'}
        ],
        password: [
          {required: true, message: '密码不可以为空', trigger: 'blur'},
          {validator: this.checkPassword, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    showAddModel() {
      this.modelVisible = true
      this.isAddUserModel = true
    },
    showUpdateModel(userId, username) {
      this.modelVisible = true
      this.isAddUserModel = false
      this.updateUserId = userId
      this.updateUsername = username
    },
    deleteUser(userId) {
      this.$http.get(`/user/delete/${userId}`).then(response => {
        if (response.data.status === 2000) {
          this.$message.info('删除成功')
          this.getUserList(1, this.userListPagination.pageSize)
        }
      }, error => {
      })
    },
    modelCancel() {
      this.modelForm = {
        username: '',
        password: ''
      }
      this.$refs.modelForm.resetFields()
    }
    ,
    modelSubmitForm() {
      this.$refs.modelForm.validate().then(res => {
        if (this.isAddUserModel) {
          this.$http.post('/user/add', this.modelForm).then(response => {
            if (response.data.status === 2000) {
              this.$message.info('添加用户成功')
              this.getUserList(1, this.userListPagination.pageSize)
              this.modelCancel()
              this.modelVisible = false
            } else if (response.data.status === 4008) {
              this.$message.info('当前用户已存在，添加失败')
              this.getUserList(1, this.userListPagination.pageSize)
              this.modelCancel()
              this.modelVisible = false
            }
          }, error => {
          })
        } else {
          let {username, password} = this.modelForm
          let id = this.updateUserId
          this.$http.post('/user/update', {username, password, id}).then(response => {
            if (response.data.status === 2000) {
              this.$message.info('修改用户成功')
              this.getUserList(1, this.userListPagination.pageSize)
              this.modelCancel()
              this.modelVisible = false
            }
          }, error => {
          })
        }
      }, ero => {
      })
    }
    ,
    selectLocation(locationId, node) {
      let userId = node.data.attrs['data-userId'];
      this.$http.post('/location/distributeLocation', {locationId, userId}).then(response => {
        if (response.data.status === 2000) {
          this.$message.info("添加成功")
        }
      }, error => {

      })
    }
    ,
    deSelectLocation(locationId, node) {
      let userId = node.data.attrs['data-userId'];
      this.$http.post('/location/deleteLocation', {locationId, userId}).then(response => {
        if (response.data.status === 2000) {
          this.$message.info("删除成功")
        }
      }, error => {

      })
    }
    ,
    getLocationList() {
      this.$http.get('/location/getAll').then(response => {
        this.locationList = response.data.data.locationList
      }, error => {

      })
    }
    ,
    getUserList(page, size) {
      this.$http.get(`/user/getAll/${page}/${size}`).then(response => {
        this.userList = response.data.data.pageInfo.list
        this.userListPagination.total = response.data.data.pageInfo.total
        this.userListPagination.currentPage = response.data.data.pageInfo.pageNum
        this.userListPagination.pageSize = response.data.data.pageInfo.pageSize
        this.userListPagination.pages = response.data.data.pageInfo.pages
      }, error => {

      })
    }
    ,
    nextPage(page, pageSize) {
      this.getUserList(page, pageSize)
    }
    ,
    checkUsername(rule, value, callback) {
      let pattern = /^[a-zA-Z0-9_-]{5,15}$/
      if (pattern.test(value)) {
        callback();
      } else {
        callback(new Error('用户名由字母数字下划线组成，长度为为5到15'));
      }
    }
    ,
    checkPassword(rule, value, callback) {
      let pattern = /^[a-zA-Z0-9]{6,16}$/
      if (pattern.test(value)) {
        callback();
      } else {
        callback(new Error('密码由字母数字组成，长度为为5到16'));
      }
    }
  },
  mounted() {
    this.getUserList(1, this.userListPagination.pageSize)
    this.getLocationList()
  }
}
</script>

<style scoped>
.userManagementContainer {
  position: relative;
}

</style>

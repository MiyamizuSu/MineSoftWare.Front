<template>
    <div class="app-container">
        <div class="header">
            &nbsp;&nbsp;<label style="font-size: 14px; font-weight: bolder;">用户名称</label>&nbsp;&nbsp;
            <el-input v-model="queryParams.userName" placeholder="请输入用户名称" clearable style="width: 240px" />
            &nbsp;&nbsp;<label style="font-size: 14px; font-weight: bolder;">真实姓名</label>&nbsp;&nbsp;
            <el-input v-model="queryParams.userRealName" placeholder="请输入真实姓名" clearable style="width: 240px" />
            &nbsp;&nbsp;<label style="font-size: 14px; font-weight: bolder;">手机号码</label>&nbsp;&nbsp;
            <el-input v-model="queryParams.userPhoneNumber" placeholder="请输入手机号码" clearable style="width: 240px" />
            &nbsp;&nbsp;<label style="font-size: 14px; font-weight: bolder;">所属企业</label>&nbsp;&nbsp;
            <el-input v-model="queryParams.belongCompany" placeholder="请输入所属企业" clearable style="width: 240px" />
            <el-button type="primary" plain icon="Search" @click="handleQuery"
                style="font-size: 14px; margin-left: 20px;">搜索</el-button>
            <el-button type="info" plain icon="Refresh" @click="resetQuery"
                style="font-size: 14px; margin-left: 20px;">重置</el-button>
        </div>

        <!-- 一排按钮 -->
        <p style="margin-top: 20px; margin-bottom: 10px;">
            <el-button type="primary" plain icon="Plus" @click="handleAdd"
                style="font-size: 13px; margin: 5px; width: 70px; text-align: center;">新增</el-button>
            <el-button type="success" plain icon="Edit" @click="handleUpdate"
                style="font-size: 13px; margin: 5px; width: 70px; text-align: center;">修改</el-button>
            <el-button type="danger" plain icon="Delete" @click="handleBatchDelete"
                style="font-size: 13px; margin: 5px; width: 70px; text-align: center;">删除</el-button>
            <el-button type="warning" plain icon="Download" @click="handleExport"
                style="font-size: 13px; margin: 5px; width: 70px; text-align: center;">导出</el-button>
        </p>

        <el-table :data="userList" @selection-change="handleSelectionChange" size="large" row-key="userName">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="头像" prop="imgUrl" width="80" align="center">
                <template #default="scope">
                    <img :src="scope.row.imgUrl" style="height: 45px; max-width: 45px; margin-right: 0;" />
                </template>
            </el-table-column>
            <el-table-column label="用户名称" prop="userName" width="200" align="center" />
            <el-table-column label="真实姓名" prop="userRealName" width="200" align="center" />
            <el-table-column label="所属企业" prop="belongCompany" :show-overflow-tooltip="true" width="200"
                align="center" />
            <el-table-column label="手机号码" prop="userPhoneNumber" width="200" align="center" />
            <el-table-column label="邮箱" prop="userEmail" width="200" align="center" />
            <el-table-column label="创建时间" prop="startTime" width="200" align="center" />
            <el-table-column label="操作" fixed="right" align="center">
                <template #default="scope">
                    <el-button type="primary" :icon="Edit" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
                    <el-popconfirm width="220px" title="确定删除该用户吗？" @confirm="handleDelete(scope.row.userName)">
                        <template #reference>
                            <el-button type="danger" :icon="Delete" size="mini" slot="reference">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background v-model:current-page="queryParams.pageNum" v-model:page-size="queryParams.pageSize"
            :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" v-model:total="total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />

        <!-- 新增用户对话框 -->
        <el-dialog v-model="addDialogFormVisible" title="新增用户" style="width: 50%; height: 80%; overflow-y: auto;"
            draggable overflow @close="handleDialogClose">
            <el-form ref="formRef" :model="userForm" :rules="rules" label-width="80px">
                <el-form-item label="用户名称" prop="userName">
                    <el-input v-model="userForm.userName" placeholder="请输入用户名称" maxlength="30" />
                </el-form-item>
                <el-form-item label="用户密码" prop="userPassword">
                    <el-input v-model="userForm.userPassword" placeholder="请输入用户密码" type="password" maxlength="20"
                        show-password />
                </el-form-item>
                <el-form-item label="用户头像" prop="imgUrl">
                    <el-upload v-if="true" list-type="picture-card" :multiple="false" :auto-upload="true" :limit="1"
                        style="margin-left: 2%" ref="uploadRef" :http-request="httpRequest">
                        <el-icon>
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="真实姓名" prop="userRealName">
                            <el-input v-model="userForm.userRealName" placeholder="请输入真实姓名" maxlength="30" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属企业" prop="belongCompany">
                            <el-select v-model="userForm.belongCompany" placeholder="请选择所属企业">
                                <el-option v-for="item in companyList" :key="item.companyName" :label="item.companyName"
                                    :value="item.companyName"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="手机号码" prop="userPhoneNumber">
                            <el-input v-model="userForm.userPhoneNumber" placeholder="请输入手机号码" maxlength="11" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="用户邮箱" prop="userEmail">
                            <el-input v-model="userForm.userEmail" placeholder="请输入用户邮箱" maxlength="50" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="角色" prop="userType">
                            <el-select v-model="userForm.userType" placeholder="请选择角色">
                                <el-option label="企业普通用户" :value=0 />
                                <el-option label="企业管理员" :value=1 />
                                <el-option label="超级管理员" :value=2 />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属部门" prop="belongCompany">
                            <el-select v-model="userForm.belongDept" placeholder="请选择所属部门">
                                <el-option v-for="item in deptList" :key="item.deptName" :label="item.companyName"
                                    :value="item.companyName"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="addDialogFormVisible = false">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 修改用户对话框 -->
        <el-dialog v-model="updateDialogFormVisible" title="修改用户" style="width: 50%; height: 80%; overflow-y: auto;"
            draggable overflow @close="handleEditDialogClose">
            <el-form ref="editRef" :model="editForm" :rules="rules" label-width="80px">
                <el-form-item label="用户头像" prop="imgUrl">
                    <el-upload v-if="true" list-type="picture-card" :multiple="false" :auto-upload="true" :limit="1"
                        :file-list="editForm.imgUrl ? [{ name: 'avatar', url: editForm.imgUrl }] : []"
                        style="margin-left: 2%" ref="uploadRef" :http-request="httpRequest">
                        <el-icon>
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="真实姓名" prop="userRealName">
                            <el-input v-model="editForm.userRealName" placeholder="请输入真实姓名" maxlength="30" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属企业" prop="belongCompany">
                            <el-select v-model="editForm.belongCompany" placeholder="请选择所属部门">
                                <el-option v-for="item in companyList" :key="item.companyName" :label="item.companyName"
                                    :value="item.companyName"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="手机号码" prop="userPhoneNumber">
                            <el-input v-model="editForm.userPhoneNumber" placeholder="请输入手机号码" maxlength="11" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="用户邮箱" prop="userEmail">
                            <el-input v-model="editForm.userEmail" placeholder="请输入用户邮箱" maxlength="50" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="角色" prop="userType">
                            <el-select v-model="editForm.userType" placeholder="请选择角色">
                                <el-option label="企业普通用户" :value=0 />
                                <el-option label="企业管理员" :value=1 />
                                <el-option label="超级管理员" :value=2 />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属部门" prop="belongCompany">
                            <el-select v-model="editForm.belongDept" placeholder="请选择所属企业">
                                <el-option v-for="item in deptList" :key="item.deptName" :label="item.deptName"
                                    :value="item.deptName"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submiteUpdateForm">确 定</el-button>
                <el-button @click="updateDialogFormVisible = false">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog v-model="batchDeleteDialogVisible" title="系统提示" width="500">
            <span style="font-size: 20px">确定删除所选项吗？</span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitDelete">确定</el-button>
                    <el-button @click="batchDeleteDialogVisible = false">取消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { ref, onMounted } from 'vue';
import { getUserList, getCompanyName, addUser, batchDeleteUser, deleteUser, updateUser } from '@/api';
import { ElMessage, type UploadFile, type UploadFiles, type UploadInstance, type UploadRequestOptions, type UploadUserFile } from "element-plus";
import { Delete, Edit } from '@element-plus/icons-vue'
import { type getSignatrue, uploadFile, type UserDate } from "@/utilTs/util"
import mitt from "mitt";
import * as XLSX from 'xlsx';

const emitter = mitt();

const total = ref(0);
const queryParams = ref({
    currentUser: localStorage.getItem('userName'),
    pageNum: 1,
    pageSize: 5,
    userName: '',
    userRealName: '',
    userPhoneNumber: '',
    belongCompany: '',
});
const userList = ref([]);
const companyList = ref([]);

const addDialogFormVisible = ref(false)
const updateDialogFormVisible = ref(false)
const batchDeleteDialogVisible = ref(false)

const formRef = ref('');
const editRef = ref('');
const userForm = ref({} as UserDate)
const editForm = ref({} as UserDate)

const httpRequest = (options: UploadRequestOptions): void => {
    const fileTo = options.file
    uploadFile(fileTo).then((res) => {
        if (res.status === 200) {
            emitter.emit('urlChange', res.data.data.links.url);
            // 更新 editForm 的 imgUrl
            editForm.value.imgUrl = res.data.data.links.url;
            // 触发视图更新
            editForm.value = { ...editForm.value };
        }
        else {
        }
    })
}

//添加用户
const handleAdd = () => {
    addDialogFormVisible.value = true;
    initCompanyName();
};

const submitForm = () => {
    formRef.value.validate(async (valid: boolean) => {
        if (valid) {
            addUser(userForm.value).then((res) => {
                if (res.data.statusCode === '200') {
                    ElMessage.success('新增用户成功');
                    addDialogFormVisible.value = false;
                    initUserList();
                }
                else {
                    ElMessage.error('新增用户失败，该用户名已存在');
                }

            })
        }
    });
};

//更新用户
const handleUpdate = (row: UserDate) => {
    if(row.userName !== undefined){
        selectedRows.value = [row]
    }
    if (selectedRows.value.length === 1) {
        initCompanyName();
        updateDialogFormVisible.value = true;
        // 获取原始头像 URL
        const originalAvatarUrl = selectedRows.value[0].imgUrl;
        // 填充 editForm
        editForm.value = { ...selectedRows.value[0], imgUrl: originalAvatarUrl };
    } else if (selectedRows.value.length > 1) {
        ElMessage.warning('只能选择一条记录');
    } else {
        ElMessage.warning('请选择一条记录');
    }
};
const submiteUpdateForm = () => {
    editRef.value.validate(async (valid: boolean) => {
        if (valid) {
            // 确保在更新之前 editForm 是最新的
            const updatedUser = { ...editForm.value };
            // 更新头像 URL
            updatedUser.imgUrl = updatedUser.imgUrl || updatedUser.originalAvatarUrl;
            updateUser(editForm.value).then((res) => {
                if (res.data.code === 200) {
                    ElMessage.success(res.data.msg);
                    updateDialogFormVisible.value = false;
                    initUserList();
                }
                else {
                    ElMessage.error();
                }

            })
        }
    });
};

//清空表单数据
function handleDialogClose() {
    // 清除表单验证消息
    formRef.value.clearValidate();
    // 清除表单数据
    userForm.value = {};
}

function handleEditDialogClose() {
    editRef.value.clearValidate();
    editForm.value = {};
}

const handleQuery = () => {
    initUserList();
};
const resetQuery = () => {
    queryParams.value.userName = '';
    queryParams.value.userRealName = '';
    queryParams.value.userPhoneNumber = '';
    queryParams.value.belongCompany = '';
    initUserList();
};

// 用于存储选中的用户数据
const selectedRows = ref<UserDate[]>([]);
// 监听选择变化
const handleSelectionChange = (selection: UserDate[]) => {
    selectedRows.value = selection;
};

// 批量删除
const handleBatchDelete = () => {
    if (selectedRows.value.length > 0) {
        batchDeleteDialogVisible.value = true;
    } else {
        ElMessage.warning('请至少选择一条记录');
    }
};
const submitDelete = () => {
    batchDeleteDialogVisible.value = false;
    if (selectedRows.value.length > 0) {
        // 调用删除API
        batchDeleteUser(selectedRows.value).then((res) => {
            if (res.data.code === 200) {
                ElMessage.success(res.data.msg);
                initUserList();
            } else {
                ElMessage.error(res.data.msg);
            }
        });
    } else {
        ElMessage.warning('请至少选择一条记录');
    }
};

const handleDelete = (userName: string) => {
    const toBack = { userName: userName }
    deleteUser(toBack).then((res) => {
        if (res.data.code === 200) {
            ElMessage.success(res.data.msg);
            initUserList();
        } else {
            ElMessage.error(res.data.msg);
        }
    });
};



const handleSizeChange = (pageSize: number) => {
    queryParams.value.pageSize = 1;
    queryParams.value.pageSize = pageSize;
    initUserList();
};
const handleCurrentChange = (pageNum: number) => {
    queryParams.value.pageNum = pageNum;
    initUserList();
};

//获取租户名
const initCompanyName = async () => {
    const res = await getCompanyName(queryParams.value);
    companyList.value = res.data.data.companyList;
};
//获取用户列表
const initUserList = async () => {
    const res = await getUserList(queryParams.value);
    if (res.data.code === 200) {
        userList.value = res.data.data.userList;
        total.value = res.data.data.total;
    } else {
        ElMessage.error(res.data.msg);
        router.push('/mainView')
    }
};

const handleExport = () => {
  // 创建一个工作簿
  const workbook = XLSX.utils.book_new();
  // 将用户列表转换为工作表
  const worksheet = XLSX.utils.json_to_sheet(userList.value);
  // 将工作表添加到工作簿
  XLSX.utils.book_append_sheet(workbook, worksheet, "用户列表");
  // 生成Excel文件并下载
  XLSX.writeFile(workbook, "用户列表.xlsx");
};

onMounted(() => {
    emitter.on("urlChange", imgUrl => {
        userForm.value.imgUrl = imgUrl as string;
    })
    initUserList();
});

const rules = ref({
    userName: [
        { required: true, message: '用户名不能为空', trigger: 'blur' },
        { min: 2, max: 20, message: '用户名长度必须介于 2 和 20 之间', trigger: 'change' }
    ],
    userPassword: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
        { min: 4, max: 20, message: '密码长度必须介于 4 和 20 之间', trigger: 'change' }
    ],
    userRealName: [
        { required: true, message: '真实姓名不能为空', trigger: 'blur' },
        { min: 2, max: 10, message: '真实姓名长度必须介于 2 和 10 之间', trigger: 'change' }
    ],
    belongCompany: [
        { required: true, message: '所属企业不能为空', trigger: 'blur' }
    ],
    userType: [
        { required: true, message: '用户类型不能为空', trigger: 'blur' }
    ],
    userPhoneNumber: [
        { required: true, message: '手机号码不能为空', trigger: 'blur' },
        { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: ['blur', 'change'] }
    ],
    userEmail: [
        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
    ]
});
</script>

<style lang='css' scoped>
.app-container {
    padding: 20px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .el-dialog {
        display: flex;

        .dialog-footer {
            display: flex;
            justify-content: right;
        }
    }

    .el-table {
        margin-top: 20px;

        .el-table-column {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .el-pagination {
        float: right;
        margin-top: 20px;
        padding: 20px;
        box-sizing: border-box;
    }

}
</style>

<template>
    <div class="app-container">
        <div class="header">
            &nbsp;&nbsp;<label style="font-size: 14px; font-weight: bolder;">租户名称</label>&nbsp;&nbsp;
            <el-input v-model="queryParams.companyName" placeholder="请输入租户名称" clearable style="width: 240px" />
            &nbsp;&nbsp;<label style="font-size: 14px; font-weight: bolder;">联系人</label>&nbsp;&nbsp;
            <el-input v-model="queryParams.connectorName" placeholder="请输入联系人" clearable style="width: 240px" />
            &nbsp;&nbsp;<label style="font-size: 14px; font-weight: bolder;">管理员</label>&nbsp;&nbsp;
            <el-input v-model="queryParams.userName" placeholder="请输入管理员" clearable style="width: 240px" />
            &nbsp;&nbsp;<label style="font-size: 14px; font-weight: bolder;">电话</label>&nbsp;&nbsp;
            <el-input v-model="queryParams.userPhoneNumber" placeholder="请输入电话" clearable style="width: 240px" />

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

        <el-table :data="companyList" @selection-change="handleSelectionChange" size="large">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="租户图标" prop="imgurl" width="220" align="center">
                <template #default="scope">
                    <img :src="scope.row.imgUrl" style="height: 45px; max-width: 45px; margin-right: 0;" />
                </template>
            </el-table-column>
            <el-table-column label="租户名称" prop="companyName" :show-overflow-tooltip="true" width="200" align="center" />
            <el-table-column label="联系人" prop="connectorName" width="220" align="center" />
            <el-table-column label="管理员" prop="userName" width="220" align="center" />
            <el-table-column label="电话" prop="userPhoneNumber" width="220" align="center" />
            <el-table-column label="操作" fixed="right" align="center">
                <template #default="scope">
                    <el-button type="primary" :icon="Edit" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
                    <el-popconfirm width="220px" title="确定删除该租户吗？" @confirm="submitDelete(scope.row)">
                        <template #reference>
                            <el-button type="danger" :icon="Delete" size="mini" slot="reference">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background v-model:current-page="queryParams.pageNum" v-model:page-size="queryParams.pageSize"
            :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />

        <!-- 新增租户对话框 -->
        <el-dialog v-model="addDialogFormVisible" title="新增租户" style="width: 50%; height: 80%; overflow-y: auto;"
            draggable overflow @close="handleDialogClose">
            <el-form ref="formRef" :model="tenantForm" :rules="rules" label-width="80px">
                <el-form-item label="租户名称" prop="companyName">
                    <el-input v-model="tenantForm.companyName" placeholder="请输入租户名称" maxlength="30" />
                </el-form-item>
                <el-form-item label="租户图标" prop="imgUrl">
                    <el-upload v-if="true" list-type="picture-card" :multiple="false" :auto-upload="true" :limit="1"
                        style="margin-left: 2%" ref="uploadRef" :http-request="httpRequest">
                        <el-icon>
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="联系人" prop="connectorName">
                    <el-input v-model="tenantForm.connectorName" placeholder="请输入联系人" maxlength="30" />
                </el-form-item>
                <el-form-item label="管理员" prop="userName">
                    <el-input v-model="tenantForm.userName" placeholder="请输入管理员用户名称" maxlength="30"></el-input>
                    &nbsp;&nbsp;<span style="font-size: 12px;">默认密码为123456</span>
                </el-form-item>
                <el-form-item label="手机号码" prop="userPhoneNumber">
                    <el-input v-model="tenantForm.userPhoneNumber" placeholder="请输入手机号码" maxlength="11" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="addDialogFormVisible = false">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 修改租户对话框 -->
        <el-dialog v-model="updateDialogFormVisible" title="新增租户" style="width: 50%; height: 80%; overflow-y: auto;"
            draggable overflow @close="handleEditDialogClose">
            <el-form ref="editRef" :model="editForm" :rules="rules" label-width="80px">
                <el-form-item label="租户名称" prop="companyName">
                    <el-input v-model="editForm.companyName" placeholder="请输入租户名称" maxlength="30" />
                </el-form-item>
                <el-form-item label="租户图标" prop="imgUrl">
                    <el-upload v-if="true" list-type="picture-card" :multiple="false" :auto-upload="true" :limit="1"
                        :file-list="editForm.imgUrl ? [{ name: 'avatar', url: editForm.imgUrl }] : []"
                        style="margin-left: 2%" ref="uploadRef" :http-request="httpRequest">
                        <el-icon>
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="联系人" prop="connectorName">
                    <el-input v-model="editForm.connectorName" placeholder="请输入联系人" maxlength="30" />
                </el-form-item>
                <el-form-item label="管理员" prop="userName">
                    &nbsp;&nbsp;<span style="font-size: 20px;">{{editForm.userName}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size: 12px;">默认密码为123456</span>
                </el-form-item>
                <el-form-item label="手机号码" prop="userPhoneNumber">
                    <el-input v-model="editForm.userPhoneNumber" placeholder="请输入手机号码" maxlength="11" />
                </el-form-item>
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
import { getCompanyList, addCompany, batchDeleteCompany, updateCompany } from '@/api';
import { ElMessage,type UploadFile,type UploadFiles,type UploadInstance,type UploadRequestOptions,type UploadUserFile} from "element-plus";
import { Delete, Edit } from '@element-plus/icons-vue'
import { type getSignatrue, uploadFile, type UserDate, type TenantDate } from "@/utilTs/util"
import mitt from "mitt";
import * as XLSX from 'xlsx';

const emitter = mitt();

const total = ref(0);
const queryParams = ref({
    currentUser: localStorage.getItem('userName'),
    pageNum: 1,
    pageSize: 5,
    companyName: '',
    connectorName: '',
    userName: '',
    userPhoneNumber: ''
});
const companyList = ref([]);

const addDialogFormVisible = ref(false)
const updateDialogFormVisible = ref(false)
const batchDeleteDialogVisible = ref(false)

const formRef = ref('');
const editRef = ref('');
const tenantForm = ref({} as TenantDate)
const editForm = ref({} as TenantDate)

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

//添加租户
const handleAdd = () => {
    addDialogFormVisible.value = true;
};
const submitForm = () => {
    formRef.value.validate(async (valid) =>{
    if (valid) {
        addCompany(tenantForm.value).then((res) => {
            if (res.data.code === 200) {     
                ElMessage.success(res.data.msg);
                addDialogFormVisible.value = false;
                initCompanyList();
            }
            else {
                ElMessage.error(res.data.msg);
            }
            
        })
        }
    });
};

//更新租户
const handleUpdate = (row: TenantDate) => {
    if(row.companyName !== undefined){
        selectedRows.value = [row]
    }
    if (selectedRows.value.length === 1) {
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
    editRef.value.validate(async (valid: string) => {
        if (valid) {
            // 确保在更新之前 editForm 是最新的
            const updatedUser = { ...editForm.value };
            // 更新头像 URL
            updatedUser.imgUrl = updatedUser.imgUrl || updatedUser.originalAvatarUrl;
            updateCompany(editForm.value).then((res) => {
                if (res.data.code === 200) {
                    ElMessage.success(res.data.msg);
                    updateDialogFormVisible.value = false;
                    initCompanyList();
                }
                else {
                    ElMessage.error(res.data.msg);
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
    tenantForm.value = {};
}
function handleEditDialogClose() {
    editRef.value.clearValidate();
    editForm.value = {};
}

const handleQuery = () => {
    initCompanyList();
};
const resetQuery = () => {
    queryParams.value.companyName = '';
    queryParams.value.connectorName = '';
    queryParams.value.userName = '';
    queryParams.value.userPhoneNumber = '';
    initCompanyList();
};

// 用于存储选中的租户数据
const selectedRows = ref<TenantDate[]>([]);
// 监听选择变化
const handleSelectionChange = (selection: TenantDate[]) => {
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
const submitDelete = (row: TenantDate) => {
    if(row.companyName !== undefined){
        selectedRows.value = [row]
    }
    batchDeleteDialogVisible.value = false;
    if (selectedRows.value.length > 0) {
        // 调用删除API
        batchDeleteCompany(selectedRows.value).then((res) => {
            if (res.data.code === 200) {
                ElMessage.success(res.data.msg);
                initCompanyList();
            } else {
                ElMessage.error(res.data.msg);
            }
        });
    } else {
        ElMessage.warning('请至少选择一条记录');
    }
};

const handleSizeChange = (pageSize:number) => {
    queryParams.value.pageSize = 1;
    queryParams.value.pageSize = pageSize;
    initCompanyList();
};
const handleCurrentChange = (pageNum:number) => {
    queryParams.value.pageNum = pageNum;
    initCompanyList();
};

//获取租户列表
const initCompanyList = async () => {
    const res = await getCompanyList(queryParams.value);
    if (res.data.code == 200) {
    companyList.value = res.data.data.companyList;
    total.value = res.data.data.total;
    }else {
        ElMessage.error(res.data.msg)
        router.push('/mainView')
    }
};

const handleExport = () => {
  // 创建一个工作簿
  const workbook = XLSX.utils.book_new();
  // 将用户列表转换为工作表
  const worksheet = XLSX.utils.json_to_sheet(companyList.value);
  // 将工作表添加到工作簿
  XLSX.utils.book_append_sheet(workbook, worksheet, "租户列表");
  // 生成Excel文件并下载
  XLSX.writeFile(workbook, "租户列表.xlsx");
};

onMounted(() => {
    emitter.on("urlChange", imgUrl => {
        tenantForm.value.imgUrl = imgUrl as string;
    })
    initCompanyList();
});

const rules = ref({
    companyName: [{ required: true, message: '请输入租户名称', trigger: 'blur' },
        { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'change' }
    ],
    connectorName: [{ required: true, message: '请输入联系人', trigger: 'blur' },
        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
    ],
    
    userName: [{ required: true, message: '请输入管理员用户名称', trigger: 'blur' },
        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
    ],
    userPhoneNumber: [{ required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: ['blur', 'change'] }
    ],
});
</script>

<style lang='scss' scoped>
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

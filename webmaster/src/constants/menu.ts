import { mdiBookOpenPageVariantOutline, mdiHomeOutline, mdiImageOutline, mdiTagOutline, mdiAccountGroupOutline } from '@mdi/js';

enum Permission {
  Block = -1,
  User = 0,
  Admin = 1,
  Master = 2,
  Root = 3
}

export const permissionMap: Record<string, string> = {
  '-1': '封禁',
  '0': '用户',
  '1': '管理员',
  '2': '副站长',
  '3': '站长'
};

export type MenuItem = {
  title: string;
  icon: string;
  to: string;
  permission: Permission;
};

export const menu: MenuItem[] = [
  { title: '主页', icon: mdiHomeOutline, to: '/home', permission: Permission.User },
  { title: '用户管理', icon: mdiAccountGroupOutline, to: '/user', permission: Permission.Master },
  { title: '标签管理', icon: mdiTagOutline, to: '/category', permission: Permission.Master },
  { title: '博客管理', icon: mdiBookOpenPageVariantOutline, to: '/blog', permission: Permission.Admin },
  { title: '图片管理', icon: mdiImageOutline, to: '/picture', permission: Permission.Admin }
];

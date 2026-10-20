import { SvgIcon } from '@mui/material';

const createAdminIcon = (path) => function AdminIcon(props) {
  return <SvgIcon viewBox="0 0 24 24" {...props}><path d={path} /></SvgIcon>;
};

export const AddPhotoAlternateOutlinedIcon = createAdminIcon('M21 19V5H3v14h18ZM3 3h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm3 14h12l-3.75-5-2.75 3.5-2-2.5L6 17Zm2-7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z');
export const AnalyticsOutlinedIcon = createAdminIcon('M4 19h16v2H2V3h2v16Zm3-2H5v-5h2v5Zm5 0h-2V7h2v10Zm5 0h-2V4h2v13Zm5 0h-2V9h2v8Z');
export const CategoryOutlinedIcon = createAdminIcon('M20.59 13.41 11 23l-9-9V2h12l9 9-2.41 2.41ZM4 4v9.17l7 7 7.17-7.17-7-7H4Zm2 2h4v4H6V6Z');
export const DeleteOutlineIcon = createAdminIcon('M6 7h12l-1 14H7L6 7Zm2-3h8l1 2H7l1-2Zm-4 2h16v2H4V6Zm5 4v8h2v-8H9Zm4 0v8h2v-8h-2Z');
export const DownloadOutlinedIcon = createAdminIcon('M11 3h2v9.17l3.59-3.58L18 10l-6 6-6-6 1.41-1.41L11 12.17V3ZM5 19h14v2H5v-2Z');
export const EditOutlinedIcon = createAdminIcon('m3 17.25 11.06-11.06 3.75 3.75L6.75 21H3v-3.75Zm14.94-14.5a1.5 1.5 0 0 1 2.12 0l1.19 1.19a1.5 1.5 0 0 1 0 2.12l-1.12 1.12-3.75-3.75 1.56-.68Z');
export const Inventory2OutlinedIcon = createAdminIcon('M3 4h18v4H3V4Zm1 6h16v11H4V10Zm4 2v2h8v-2H8Z');
export const LogoutOutlinedIcon = createAdminIcon('M10 17v-2h5V9h-5V7l-5 5 5 5Zm8-14H6a2 2 0 0 0-2 2v3h2V5h12v14H6v-3H4v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z');
export const MailOutlineIcon = createAdminIcon('M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z');
export const SearchOutlinedIcon = createAdminIcon('M15.5 14h-.79l-.28-.27A6.5 6.5 0 1 0 14 15.5l.27.28v.79L20 22l2-2-6.5-6ZM10 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z');
export const StarOutlineIcon = createAdminIcon('m12 17.27 5.18 3.13-1.38-5.9L20.39 10l-6.06-.52L12 3.9 9.67 9.48 3.61 10l4.59 4.5-1.38 5.9L12 17.27Zm0-2.36-2.5 1.51.67-2.85-2.22-2.18 2.93-.25L12 8.45l1.12 2.69 2.93.25-2.22 2.18.67 2.85-2.5-1.51Z');
export const StorefrontOutlinedIcon = createAdminIcon('M3 4h18l2 6v2a3 3 0 0 1-2 2.83V21H3v-6.17A3 3 0 0 1 1 12v-2l2-6Zm1.5 2L3 10.5V12a1 1 0 0 0 2 0v-1h2v1a1 1 0 0 0 2 0v-1h2v1a1 1 0 0 0 2 0v-1h2v1a1 1 0 0 0 2 0v-1h2v1a1 1 0 0 0 2 0v-1.5L19.5 6h-15ZM5 15.65V19h14v-3.35a3 3 0 0 1-2-.95 3 3 0 0 1-4 0 3 3 0 0 1-4 0 3 3 0 0 1-4 .95Z');

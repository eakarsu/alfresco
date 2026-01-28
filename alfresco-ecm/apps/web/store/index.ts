import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import documentReducer from './slices/documentSlice';
import workflowReducer from './slices/workflowSlice';
import collaborationReducer from './slices/collaborationSlice';
import notificationReducer from './slices/notificationSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    document: documentReducer,
    workflow: workflowReducer,
    collaboration: collaborationReducer,
    notification: notificationReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['document/uploadProgress', 'workflow/updateTask'],
        ignoredPaths: ['document.uploadingFiles', 'workflow.activeTasks'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
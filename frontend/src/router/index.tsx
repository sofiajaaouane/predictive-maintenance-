import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Dashboard } from '../pages/Dashboard';
import { Machines } from '../pages/Machines';
import { MachineDetail } from '../pages/MachineDetail';
import { Predictions } from '../pages/Predictions';
import { Alerts } from '../pages/Alerts';
import { MLPipeline } from '../pages/MLPipeline';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'machines',
        element: <Machines />,
      },
      {
        path: 'machines/:id',
        element: <MachineDetail />,
      },
      {
        path: 'predictions',
        element: <Predictions />,
      },
      {
        path: 'alerts',
        element: <Alerts />,
      },
      {
        path: 'ml-pipeline',
        element: <MLPipeline />,
      },
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
]);

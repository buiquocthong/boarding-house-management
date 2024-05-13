'use client';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import React, { useCallback, useMemo, useState } from 'react';
import {
  useDeleteRoomMutation,
  useGetRoomsQuery,
  useUpdateRoomMutation,
} from '@/libs/services/roomApi';
import { IRowDragItem, ModuleRegistry } from '@ag-grid-community/core';
import {
  CellClickedEvent,
  CellEditRequestEvent,
  ClientSideRowModelModule,
  ColDef,
  IRowNode,
  IsExternalFilterPresentParams,
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import {} from 'ag-grid-enterprise';
import '@/app/(management)/manage/(room)/style.css';
import { AgGridReact } from 'ag-grid-react';
import { GetRowIdParams } from 'ag-grid-community';
import { useAppDispatch } from '@/libs/hooks';
import { setSelectedRowId } from '@/libs/features/gridSlice';
import CustomDropdown from './CustomDropdown';
import AutocompleteEditor from './grid/AutocompleteEditor';
import { getReadableNumber, isNumeric } from '@/utils/converterUtil';
import ImmutableColumn from './ImmutableColumn';
import {
  useGetTenantsQuery,
  useUpdateTenantMutation,
} from '@/libs/services/tenantApi';
import { IAddress } from '@/utils/types';
import { stringify } from 'querystring';
import CustomDatePicker from './CustomDatePicker';
import EditAddressModal from './EditAddressModal';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const TenantGrid = ({
  gridRef,
  isExternalFilterPresent,
  doesExternalFilterPass,
}: {
  gridRef: React.RefObject<AgGridReact<any>>;
  isExternalFilterPresent: (params: IsExternalFilterPresentParams) => boolean;
  doesExternalFilterPass: (node: IRowNode) => boolean;
}) => {
  const dispatch = useAppDispatch();
  const {
    data: tenants = [],
    isLoading: isTenantLoading,
    error: tenantError,
  } = useGetTenantsQuery(null);
  const [updateTenantTrigger] = useUpdateTenantMutation();
  const [deleteTenantTrigger] = useDeleteRoomMutation();

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      headerName: '',
      colId: 'movableCol',
      valueGetter: (params) => {
        return null;
      },
      width: 100,
      resizable: false,
      rowDrag: true,
      sortable: false,
      lockPosition: 'left',
      enableRowGroup: false,
      floatingFilter: false,
      filter: false,
      editable: false,
      cellRendererSelector: (params) => {
        if (!params.data) {
          return undefined;
        }
        return {
          component: ImmutableColumn,
          params: {
            iconSize: 32,
            iconSrc: '/image/tenant/tenant.png',
          },
        };
      },
      pinned: 'left',
      lockPinned: true,
      suppressColumnsToolPanel: true,
      suppressFiltersToolPanel: true,
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
    },
    {
      headerName: 'ID',
      field: 'id',
      editable: false,
      width: 100,
      resizable: false,
      rowGroup: false,
      lockPosition: 'left',
      enableRowGroup: false,
      // pinned: 'left',
      lockPinned: true,
      suppressMovable: true,
      suppressColumnsToolPanel: true,
      suppressFiltersToolPanel: true,
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
    },

    {
      headerName: 'Full name',
      field: 'fullName',
      cellDataType: 'string',
    },
    {
      headerName: 'Email',
      field: 'email',
      cellDataType: 'string',
    },
    {
      headerName: 'Phone',
      field: 'phone',
      cellDataType: 'string',
    },
    {
      headerName: 'ID card number',
      field: 'idCardNumber',
      cellDataType: 'string',
    },
    {
      headerName: 'Gender',
      field: 'gender',
      cellDataType: 'string',
      cellEditor: AutocompleteEditor,
      cellEditorParams: {
        items: [{ value: 'MALE' }, { value: 'FEMALE' }],
        label: 'Select gender',
      },
    },
    {
      headerName: 'Address',
      field: 'address',
      cellDataType: 'string',
      valueGetter: (params) => {
        if (!params.data || !params.data.address) {
          return null;
        }
        const address = params.data.address as IAddress;
        const addressArr = [
          address.street,
          address.ward,
          address.district,
          address.city,
        ];
        return addressArr.join(', ');
      },
      cellEditorSelector: (params) => {
        if (!params.data) {
          return undefined;
        }
        return {
          component: EditAddressModal,
          params: {
            label: 'Edit Address',
            currentValue: params.data.address,
          },
        };
      },
    },
    {
      headerName: 'Birthday',
      field: 'birthday',
      cellStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      cellEditorSelector: (params) => {
        if (!params.data) {
          return undefined;
        }
        return {
          component: CustomDatePicker,
          params: {
            label: 'Birth date',
          },
        };
      },
    },
    {
      headerName: 'Career',
      field: 'career',
    },
    {
      headerName: '',
      colId: 'menuCol',
      valueGetter: (params) => {
        return null;
      },
      width: 50,
      resizable: false,
      sortable: false,
      lockPosition: 'right',
      enableRowGroup: false,
      floatingFilter: false,
      filter: false,
      editable: false,
      cellStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      cellRendererSelector: (params) => {
        if (!params.data) {
          return undefined;
        }
        return {
          component: CustomDropdown,
          params: {
            items: [
              {
                value: 'View sample temporary residence text',
              },
              {
                value: 'print a temporary residence document form',
                color: 'success',
                className: 'text-success',
              },
              {
                value: 'Tenants self-enter',
              },
              {
                value: 'Remove a tenant',
                color: 'danger',
                className: 'text-danger',
                // onPress: async (e: any, selectedRowId: number) => {
                //   await handleDeleteRoom(selectedRowId);
                // },
              },
            ],
          },
        };
      },
      pinned: 'right',
      lockPinned: true,
      suppressColumnsToolPanel: true,
      suppressFiltersToolPanel: true,
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
    },
  ]);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      enableRowGroup: true,
      cellDataType: false,
      width: 200,
    };
  }, []);
  const rowDragText = useCallback(
    (params: IRowDragItem, dragedCount: number) =>
      dragedCount > 1
        ? dragedCount + ' users'
        : 'User: ' + params.rowNode!.data.fullName + [],
    [],
  );

  const handleUpdateTenant = async (tenant: any) => {
    try {
      const updatedTenant = await updateTenantTrigger(tenant).unwrap();
      console.log('Tenant updated: ' + JSON.stringify(updatedTenant));
    } catch (err) {
      console.error(err);
    }
  };
  const handleDeleteRoom = useCallback(async (tenantId: number) => {
    try {
      await deleteTenantTrigger(tenantId).unwrap();
      console.log('Tenant deleted: ' + tenantId);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const onCellClicked = (event: CellClickedEvent) => {
    if (event.colDef.colId === 'menuCol') {
      const rowId = event.data.id as number;
      dispatch(setSelectedRowId(rowId));
    }
  };

  const onCellEditRequest = useCallback(async (event: CellEditRequestEvent) => {
    const oldData = event.data;
    const newData = { ...oldData };
    const field = event.colDef.field;
    newData[field!] = event.newValue;
    const tx = {
      update: [newData],
    };
    const updateData = {
      id: oldData.id,
      [field!]: event.newValue,
    };
    try {
      await handleUpdateTenant(updateData);
    } catch (err) {
      console.error(err);
      return;
    }
    event.api.applyTransaction(tx);
  }, []);
  const getRowId = useCallback((params: GetRowIdParams) => params.data.id, []);

  //
  if (isTenantLoading) {
    return <div>Loading...</div>;
  }
  if (tenantError) {
    return <div>Error</div>;
  }
  //

  //
  return (
    <div className="ag-theme-quartz w-full" style={{ height: 500 }}>
      <AgGridReact
        ref={gridRef}
        // Option: Definition
        rowData={tenants}
        // @ts-ignore
        columnDefs={columnDefs}
        // @ts-ignore
        defaultColDef={defaultColDef}
        // Feat: Pagination
        // pagination={true}
        // paginationPageSize={10}
        // paginationPageSizeSelector={[10, 25, 50]}

        // Feat: Drag
        rowDragMultiRow={true}
        rowDragManaged={true}
        rowSelection={'multiple'}
        // @ts-ignore
        rowDragText={rowDragText}
        // Feat: Panel
        enableFillHandle={true}
        enableRangeSelection={true}
        rowGroupPanelShow="always"
        // sideBar={['columns']}
        // Option: Grid properties
        rowHeight={60}
        // Feat: Editing
        readOnlyEdit={true}
        reactiveCustomComponents={true}
        onCellEditRequest={onCellEditRequest}
        getRowId={getRowId}
        isExternalFilterPresent={isExternalFilterPresent}
        doesExternalFilterPass={doesExternalFilterPass}
        onCellClicked={onCellClicked}
        suppressAnimationFrame={true}
      />
    </div>
  );
};

export default TenantGrid;
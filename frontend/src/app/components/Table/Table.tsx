import { Table } from 'antd';
import { TableComponentProps } from './interfaces';

import './index.scss'

const TableComponent = ({ columns, dataSource }: TableComponentProps) => {

    return (
        <div>
            <Table
                dataSource={dataSource} columns={columns}
                scroll={{ x: true, y: 220 }}
                pagination={false}
            />
        </div>
    )
}

export default TableComponent;

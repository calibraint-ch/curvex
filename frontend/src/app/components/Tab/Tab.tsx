import { Tabs } from 'antd';
import { tabOptions } from './constants'
import './index.scss'

const Tab = () => {
    return (
        <div>
            <Tabs
                defaultActiveKey="1"
                centered
                items={tabOptions.map((Item) => {
                    return {
                        label: (
                            <span>
                                <Item.Icon />
                                {Item.label}
                            </span>
                        ),
                        key: Item.key,
                        children: Item.children,
                    };
                })}
            />
        </div >
    )
}

export default Tab;

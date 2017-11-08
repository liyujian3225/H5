/**
 * Created by Brian on 6/05/2017.
 */
let myUBackProtocol = [
    {type: 'head', className: 'p-center',
        text: '广告制作协议'},
    {type: 'normal',
        text: '甲方：中国农业银行股份有限公司甘谷支行       （以下简称甲方）'},
    {type: 'normal',
        text: '乙方：孟强 智诚广告经营部                  （以下简称乙方）'},
    {type: 'normal', className:'p-text-indent',
        text: '甲乙双方为明确各自的权利和义务，经友好协商，根据《中华人民共和国合同法》、《中华人民共和国广告法》及其他法律、法规之规定，现就乙方承揽农行广告制作事宜达成如下一致协议。'},
    {type: 'title',
        text: '一：广告制作内容：'},
    {type: 'normal', className:'p-text-indent',
        text: '手提袋制作 1500个，每个3元，共计4500元整。'},
    {type: 'title',
        text: '二：造价及支付方式 '},
    {type: 'subTitle' ,
        text: '1.广告宣传（即合同总价款）'},
    {type: 'normal', className:'p-text-indent',
        text: '共计人民币15000元，大写壹万伍仟元整。'},
    {type: 'normal', className:'p-text-indent',
        text: '共计人民币15000元，大写壹万伍仟元整。'},
    {type: 'normal', className:'p-text-indent',
        text: '共计人民币15000元，大写壹万伍仟元整。'},
    {type: 'normal', className:'p-text-indent',
        text: '共计人民币15000元，大写壹万伍仟元整。'},
    {type: 'normal', className:'p-text-indent',
        text: '共计人民币15000元，大写壹万伍仟元整。'},
    {type: 'normal', className:'p-text-indent',
        text: '共计人民币15000元，大写壹万伍仟元整。'},
    {type: 'normal', className:'p-text-indent',
        text: '共计人民币15000元，大写壹万伍仟元整。'},
    {type: 'normal', className:'p-text-indent',
        text: '共计人民币15000元，大写壹万伍仟元整。'},
    {type: 'normal', className:'p-text-indent',
        text: '共计人民币15000元，大写壹万伍仟元整。'},
    {type: 'subTitle' ,
        text: '2.支付方式'},
    {type: 'normal', className:'p-text-indent',
        text: '制作完成乙方开具正式发票由甲方转帐支付。'},
    {type: 'bold' , text: '完'},
];

let protocols = {
    'myUBack': {
        header: '优币返还规则',
        protocol: myUBackProtocol,
    },
    'Presentation': {
        header: '优币赠送协议',
        protocol: myUBackProtocol,
    },
    'Prepayments': {
        header: '预付款协议',
        protocol: myUBackProtocol,
    },
    'Withdraw': {
        header: '提现协议',
        protocol: myUBackProtocol,
    },
    'BindBank': {
        header: '绑定协议',
        protocol: myUBackProtocol,
    },
    'Proxy': {
        header: '代理协议',
        protocol: myUBackProtocol,
    }
};

export {protocols};

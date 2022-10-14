## 一、项目准备工作
### 1. 构建项目
```
1. mkdir hardhat-smart-contract-erc20
2. cd hardhat-smart-contract-erc20
3. yarn init -y
4. yarn add --dev hardhat
5. yarn hardhat
6. 选择项目使用语言(javascript、TypeScript)
7. 一路下一步，注意：一定要安装好很多第三方包，默认是不给安装的
```
### 2. 配置格式化代码插件
```
1. 安装：yarn add --dev prettier
2. 新建.prettierrc文件
3. 在.prettierrc中填入下面配置
    {
        "tabWidth": 4,
        "useTabs": false,
        "semi": false,
        "singleQuote": false
    }
```
### 3. 配置配置文件
```
1. 安装：yarn add --dev dotenv
2. 新建.env文件，在该文件下编写配置信息，键值对的形式
    private_key=xxxx
    app_key=1212123
2. 配置：在hardhat.config.ts中填入下面代码
    import * as dotenv from "dotenv"
    dotenv.config()
    const privateKey = process.env.private_key
    const appKey = process.env.app_key
```
## 二、hardhat-deploy的使用
```
1. 安装：yarn add --dev hardhat-deploy
2. 使用
    - 在根目录下新建deploy文件夹
    - 在deploy目录下新建部署文件，注意命名规范（只要顺序就好）
    - 01-mock-deploy.ts
    - 02-classToken-deploy.ts
3. 具体详细请看具体代码
```
## 三、测试脚本的编写
> 具体请看代码
## 四、注意
1. 在`ethers.getContract(name)`这个方法不能用了，所以我们找了一个替代的方法。
```ts
// const classToken = await ethers.getContract("ClassToken") 不能用了
const { deployments } = require("hardhat")
const classTokenTemp = await deployments.get("ClassToken")
const classToken = await classTokenTemp.getContractAt(classTokenTemp.abi, classTokenTemp.address)
```
2. 在`describe`函数中，最好不要使用`await`关键字，可能会导致该`describe`不会被`hardhat`的测试脚本扫描到
3. `Contract.connect()`该方法是切换签名人的，最终会返回一个Contract对象，但是，不能传入一个钱包地址，不然会报出`VoidSigner`。下面是`connect`的具体实现。从下面的实现中可以看到，当我们传入一个`address`的时候，代表此时的参数是`string`类型，会返回一个`VoidSigner`对象，但是该对象不能`signed`交易，所以会报错。
```ts
connect(signerOrProvider: Signer | Provider | string): Contract {
    if (typeof(signerOrProvider) === "string") {
        signerOrProvider = new VoidSigner(signerOrProvider, this.provider);
    }

    const contract = new (<{ new(...args: any[]): Contract }>(this.constructor))(this.address, this.interface, signerOrProvider);
    if (this.deployTransaction) {
        defineReadOnly(contract, "deployTransaction", this.deployTransaction);
    }

    return contract;
}
```
4. `getNamedAccounts()`方法是必须在`hardhat.config.ts`中配置。在`namedAccounts`中配置啥，后面就能通过`getNamedAccounts()`取到啥
```ts
// hardhat.config.ts
const config: HardhatUserConfig = {
    namedAccounts: {
        deployer: 0,
        tokenOwner: 1,
        xxx: 2,
    },
}
// classToken.test.ts
const { getNamedAccounts } = require("hardhat")
const {deployer, tokenOwner, xxx} = await getNamedAccounts()
```
5. 在测试文件中不可以使用`import`和`from`关键字进行导包。否则会报错：`SyntaxError: Cannot use import statement outside a module`
```ts
import {getNamedAccounts} from "hardhat" // 这是错误的，会报错的
const {getNamedAccounts} = require("hardhat") // 这是正确的
```
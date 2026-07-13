---
title: 环境配置简易指南
tags:
  - guide
date: 2026-07-11
---

这个指南初衷是为了给igem队员提供干实验配置教程，但是鉴于我的电脑装了的东西我自己都忘了怎么配置的了，所以该指南也会夹带一点给自己看的东西。因为该指南是面向非计算机专业学生的，所以除了直接的操作步骤之外我还会简单介绍一下涉及的各种概念。对于目前在看这篇文章的igem队员，你们主要看[第二章](#环境配置之前需要知道的事)的**蓝字部分**，[第四章](#配置的通用流程)和[第五章](#具体的软件配置)（Git, vscode, Python, Anaconda, C++, pnpm, WSL2）即可，这是干实验目前会涉及到的内容。如果不想看介绍的话也可以直接只看第四章和第五章进行操作。

## 环境配置到底是什么？
还记得某个带点的同学下了官网的安装包后就跟我说已经配置完了，让我感受到了这一章节的必要性。当你从官网下载了神秘的setup程序或压缩包的时候，你还需要运行程序/解压压缩包后运行程序来进行安装。安装后可能就会觉得万事大吉了：我已经在对应的位置进行了安装，到时候要运行的话直接顺着路径（路径指的是你电脑任意文件的具体位置，比如我的这篇博客的路径是`E:\Code\studyblog\source\_posts\env-config.md`）找不就好了？或者直接点击快捷方式（软件图标左下角带箭头的就是快捷形式，注意删了这个不代表删了软件）不就好了？面对一般的软件的确如此，不过在终端，我们是需要输入指令来使用对应的软件的。举个例子，当我们在终端输入 `python hello_world.py` 的时候，如果不进行环境配置的话，操作系统为了使用python程序来运行你的hello_world代码会直接在代码文件对应的文件夹寻找有无python.exe，没有的话也懒得扫描整个电脑，而是直接摆烂 `“python”不是内部或外部命令`。为了让懒蛋电脑能让你的代码不论扔在哪里都能运行python.exe，环境配置的其中一个目的就是如此：通过设置环境变量，让你的电脑面对任何诸如`python`的指令都能直接通过对应的PATH找到对应的程序。当你再次输入 `python`时，系统在当前文件夹没找到后就会闪现到PATH记录的python安装目录里把程序抓出来运行。

通过这个例子，你大概就能清楚环境配置本质是为了让懒蛋电脑不需要到处找需要的程序，而是能直接靠你费劲千辛万苦的环境配置来避免以后的麻烦操作，知道本质后再配置就不会一头雾水。环境配置主要负责解决：
- **工具在哪！？** 用环境变量设置来让系统在不同的任务中顺着PATH找到需要的工具；
- **哪个版本！？** 我的电脑装了一万个版本的python（开发需要和机器学习时用的不太一样），导致有时候会出现版本冲突，环境配置可以让系统在面对不同的使用目的使用不同版本的软件；
- **我依赖谁！？** 并不是所有代码都是你自己写的，你可以薅走别人写的现成的库来调用，而一般说的`dependency`就是指的这种第三方库，第三方库主要由pip/conda/npm/cargo/CMake等包管理器或构建系统管理，也会依靠到系统环境变量。
- **怎么运行！？** 用vscode写代码后，如果不设置如何预处理，编译，汇编和链接 [^1]，它其实和笔记本区别也不大（当然这么说有点武断，目前可以这么理解），所以需要环境设置来让vscode将代码文件变成可运行程序。

## 环境配置之前需要知道的事
### 了解你的系统信息
配置环境前请到电脑的 设置-系统-关于 来了解你的电脑系统架构，这对于环境配置十分重要，因为这决定了你需要下什么格式的程序。以我用的电脑举例，我的系统信息为：
```plain text
操作系统：Microsoft Windows 11 Home
系统架构：64-bit / x64
CPU（处理器）架构：Intel x64，CPU 为 12th Gen Intel(R) Core(TM) i7-1255U
显卡（图形卡）：Intel(R) Iris(R) Xe Graphics
内存（RAM）：16.0 GB
终端：PowerShell 5.1，Desktop Edition
```
我们分别来看看这几个信息说明了什么：
- **操作系统[^2]**：一般分Windows/macOS/Linux，我的就是Windows（而且还是家庭版，说明我没有sandbox等功能）。不同系统的文件结构，各种权限，使用的指令和资源管理都不同，比如Windows的路径是用反斜杠`\`，而Linux和macOS用正斜杠`/`，配置和使用的时候要注意区别。因此配置方式不同，不能直接照抄。
- **系统架构/CPU**：这个真正决定了到底下载什么版本的程序。我的是intel x64，其实就是AMD64[^3]，可以直接理解为“64位的x86架构”。“x64，x86_64，amd64，win64，windows-x64，windows-amd64”等指的都是一个东西，所以安装程序时我找对应的后缀的安装程序即可。如果看到“arm64，aarch64”，那是给ARM架构电脑（比如Apple Silicon/M系列MacBook）使用的；“x86，i386，win32”是给32位架构的，现在的话基本可以不管，太古老了。
- **显卡（GPU）**：我的电脑上的是核芯显卡（集成显卡），意味着我其实没有独显，当需要处理图形或大计算时，它是动态地使用系统内存来用的。所以主流CUDA训练/大模型任务基本不适合用在我这个电脑，这也是为什么这类任务我需要用云服务器或实验室的服务器来跑。
- **内存**：16gb是比较普遍和够用的内存量，对于igem的pipeline而言应该不会占多少内存，运行速度会比较快。
- **终端**：windows有powershell和cmd两种终端。cmd是老古董了，很多指令和脚本无法处理，并且无执行策略限制，所以一般都是使用powershell。等下载git后还可以使用git bash来在windows系统中使用linux指令（它能在win里模拟linux行为）。

**下程序的时候请严格按照系统架构下载对应的软件，不然会出现兼容性问题。** 其他的系统信息是方便你了解电脑的性能的。该教程会以我的电脑信息为背景进行编写，所以如果和我不同的话还需要进行调整。我不太了解Mac该怎么配置，所以可能会询问大模型并作为附录写在最后。


### 环境变量概念辨析
首先你有两种方式可以进入环境变量设置，以windows为例：
- 按下`Win + R`键，输入`sysdm.cpl`并按回车打开系统属性。点击“高级”选项卡然后点击“环境变量”。
- 在桌面的“此电脑”图标上单击鼠标右键，在弹出的菜单中选择“属性”。然后点击“环境变量”。

进入后可以看到用户变量和系统变量：
- 用户变量：只对当前登录的Windows账号生效。修改这里不需要管理员权限。如果这台电脑只有你一个人用，把路径加到这里的Path是最安全、最省事的。一般的环境配置也只用管这部分。
- 系统变量：对这台电脑里的所有账号都生效。修改这里必须拥有管理员权限。像Java、Conda等很多大型软件默认喜欢把自己塞进系统变量里。一般不动系统变量。

看到用户变量后，你可以看到几种不同的环境变量，这里以我的两个用户变量为例：
```plain text
Path: D:\python3.10\Scripts\;D:\python3.10\;D:\mysql\mysql_shell\bin\...
CARGO_HOME: D:\Rust\.cargo
```
环境变量是以键值的形式记录的，而Path变量可以用分号分隔多个路径[^4]。一般情况下你只需要动标着Path的这个环境变量，直接点击这一行然后选择新建即可。因为操作系统根据指令寻找某个软件的时候，一般是从Path里的路径按照从上到下的顺序寻找的。以后配置该教程没出现的软件时，其他教程也会直接让你在这里直接新加需要的路径。加了后，你每次运行就不需要写出完整的程序路径，而是使用简单的指令即可。比如这两个查询cmake版本的指令在加入环境变量后其实是等价的：
```powershell
cmake --version
D:\CMake\bin\cmake.exe --version
```

大部分情况下，教程都会叫你把`bin`目录放入环境变量。`bin`是`binary`的缩写，意思是“可执行程序目录”。软件的可直接运行的程序一般都放在这里。还有一些不那么重要但是可以知道的软件目录，当你自己开发软件的时候，文件夹命名也最好遵照这种约定俗成的命名方式：
- `lib`：库文件目录。程序运行或编译时依赖的库，比如.dll，.lib，.jar，.so;
- `include`：头文件目录。C/C++编译时用，比如.h，.hpp;
- `src`：源码目录;
- `share`：共享资源，比如文档，模板，配置，语言包;
- `etc/conf/config`：配置文件;
- `docs/doc`：文档;
- `scripts`：脚本工具，Python里常见;
- `plugins/extensions`：插件目录;
- `data`：数据文件;
- `logs`：日志文件;
- `cache`：缓存文件;
- `tools`：附加工具;

那么`CARGO_HOME`又是什么呢？这一般是给软件看的根目录路径（这点与path不同，path是给操作系统看的），因为当系统顺着path路径启动了软件后，有些工具链/生态工具约定读取`_HOME`来定位根目录。有些软件会帮你直接配置好这部份，就不用自己乱动了。不过当你配置完后可能会发现有的语言（比如python，c++）对比诸如rust的语言不需要home，这是因为它们寻找根目录的逻辑并不相同，区别可以见下表（由codex提供）：

| 语言/工具         | 终端找命令主要靠什么                                     | 是否常需要 `_HOME`                   | 软件自己找依赖/家当的主要方式                                               |
| ----------------- | -------------------------------------------------------- | ------------------------------------ | --------------------------------------------------------------------------- |
| Python            | `Path`                                                   | 通常不需要                           | 根据 `python.exe` 位置、虚拟环境、`pyvenv.cfg`、`sys.path` 等规则查找       |
| Anaconda / Conda  | `Path` 或 `conda init`                                   | 通常不需要手动设                     | 通过 conda 环境、激活脚本和环境目录管理                                     |
| Java / JDK        | `Path`                                                   | 常建议设 `JAVA_HOME`                 | Java 本身可定位 JDK 文件，Maven/Gradle/IDE 常通过 `JAVA_HOME` 找 JDK 根目录 |
| C/C++ MinGW / GCC | `Path`                                                   | 通常不需要                           | 编译器内置搜索路径、安装目录相对路径、`-I` / `-L` 参数                      |
| C/C++ MSVC        | Developer Command Prompt 或 `VsDevCmd.bat` 设置的 `Path` | 通常不靠 `_HOME`                     | `VsDevCmd.bat` 临时设置 `PATH`、`INCLUDE`、`LIB`、`LIBPATH`                 |
| Node.js           | `Path`                                                   | 通常不需要                           | 根据 Node 安装位置、项目 `node_modules` 和模块解析规则查找                  |
| pnpm / yarn       | `Path`                                                   | 通常不需要                           | 根据项目配置、锁文件、全局 store、`node_modules` 管理                       |
| Rust              | `Path`                                                   | 通常会有 `CARGO_HOME`、`RUSTUP_HOME` | `rustup` 管工具链，`cargo` 管项目依赖和缓存                                 |
| Go                | `Path`                                                   | 现代 Go 通常不需要手动设             | Go Modules、`go.mod`、模块缓存、`GOROOT`                                    |
| .NET / C#         | `Path`                                                   | 通常不需要                           | .NET SDK 自己管理编译器、模板、运行时和项目依赖                             |
| R                 | `Path` 或 IDE 选择                                       | 通常不需要                           | R 安装目录、用户库目录、`.libPaths()`                                       |
| CUDA              | `Path` + `CUDA_PATH`                                     | 常需要 `CUDA_PATH`                   | CUDA Toolkit、驱动、库目录                                                  |
| Android SDK       | `Path` + `ANDROID_HOME` / `ANDROID_SDK_ROOT`             | 常需要                               | Android SDK 目录、Gradle、IDE 配置                                          |
| MySQL             | `Path`                                                   | 通常不需要                           | 客户端连接 MySQL Server；服务端读取自己的配置文件和数据目录                 |

### 几个建议
对电脑进行配置的时候建议遵守以下原则，以避免出现莫名其妙的麻烦：
- **路径不要出现中文，文件夹和文件命名尽量使用英文。** 一些国外的开源软件和生信工具，以及部分旧工具，脚本，底层库或跨平台工具对中文路径支持不好，会容易报出完全看不懂的乱码错误。
- **路径不要出现空格，如需分开单词的话使用`-`或`_`。** 比如“Hello-world”或“Hello_world”。在命令行里，空格是用来分隔不同命令的。如果命令没有正确加引号，空格会被当作参数分隔符。现代工具一般能处理空格路径，但为了少踩坑，配置开发环境时避免空格更稳。虽然也可以使用驼峰命名（Camel Case）（比如“HelloWorld”），但是有的系统对大小写不敏感，所以一般使用前面所说的短横线或下划线。
- **不要无管理地安装多个版本。** 容易导致需要用软件的时候操作系统找不到使用哪个版本的软件，除非你会用版本管理或明确各个版本面对不同任务的优先级并进行设置。
- **软件尽量安装在同一个盘，并且安装完后不要随便手动移动已安装的软件目录。** 比如我的绝大部分开发软件都安装在了D（software）盘，这样能方便管理和排查问题。一些系统级组件建议优先使用官方默认路径[^5]。很多软件安装时会写入注册表，服务，快捷方式和更新器配置，直接剪切到别的盘可能坏掉导致软件无法使用。如果你软件配置彻底搞砸了，直接卸载并重新安装和设置。
- **配置完环境变量后要重启终端。** 已打开的终端通常不会自动读取最新环境变量，配置完后务必彻底关闭软件并重启。

## 软件分类
以下是对于一些会安装到的软件的分类和介绍。igem主要会用到python，包管理器，git和IDE。

### 编译器（Compiler）
- **例子** ：gcc (Linux C), g++ (C++), cl (Windows C++), javac (Java), rustc (Rust)
- **用处** ：编译器负责把你写的源代码完整翻译成电脑芯片能直接执行的机器码，字节码或其他中间表示，详细点的流程可以见注释1。用编译器的语言会在运行前有独立的编译阶段，并且需要全部代码编译无误生成目标文件后才能运行，所以debug比较折磨。因为像c++和rust是直接执行底层机器码，所以运行速度很快且优化空间大，这也是c++和rust通常被用于底层系统和引擎开发的原因。注意这里的例子也列举了java，因为有的语言结合了编译器和解释器进行使用（比如Java需要先编译Java字节码），详见下一条。

### 解释器/运行时（Interpreter/Runtime）
- **例子** ：python (Python), node (JavaScript), java (Java 虚拟机)
- **用处** ：和编译器不同，解释器不会一次性完整解释所有代码，即不会像C/C++那样先生成一个独立可执行文件再运行。所以电脑里必须一直装有对应语言解释器，脚本才能跑得起来。这种每次执行都要解释的机制（虽然有点简化）导致运行速度会比单纯用编译器的语言慢。

### 包管理器与虚拟环境（Package&Environment Manager）
- **例子** ：pip (Python), conda (多语言/生信专用), npm (Node.js), cargo (Rust)
- **用处** ：包管理器是负责管理你安装（即之前说过的，薅走的别人写的代码）的第三方库。在igem的干实验中，你想用别人写好的功能（比如想用pandas处理表格）就直接在终端调遣包管理器`pip install pandas`，它就会自动去云端仓库帮你把代码安全地抓取到本地装好。虚拟环境是一个独立的运行空间，主要用于隔离不同项目所需的解释器和依赖包，避免相互干扰或版本冲突。当你的项目A需要旧版工具，项目B需要新版工具时，如果全装在系统全局就会打架覆盖。这时候可以直接用conda或者python自带的venv来创建单独的环境空间，对于每个项目只使用对应的虚拟环境，并只在那个虚拟环境安装需要的包。

### 构建工具（Build Tool）
- **例子** ：cmake, make, msbuild (微软专用), maven (Java)
- **用处** ：这个我只有写c++的时候用过。当写一个包含一万个文件需要互相调用的大型项目时，手动去用编译器一行行编译会把人累死。构建工具的作用是定义编译的顺序（如 CMakeLists.txt），指挥编译器“先编译A，再编译B，最后把它们链接在一起。”来让编译过程更加高效。

### 版本控制工具（Version Control System）
- **例子** ：Git
- **用处** ：版本控制工具负责记录代码的每一次修改历史，可以清楚了解自己每次修改做了什么。当多个人同时修改同一个代码文件时，Git会把大家的修改安全地融合在一起，防止互相覆盖（以及方便看是谁写了屎山代码）。注意Git是本地的工具，而GitHub/GitLab是存放代码的远程网站，两者不要混淆（日后大概会写一下git的使用规范和github的使用教程，方便团队协作使用）。安装Git后你还可以用git bash，如前面所说，这个可以让你在windows系统使用linux指令。

### 代码检查与格式化工具（Linter/Formatter）
- **例子** ：Ruff, Black, Flake8
- **用处** ：代码检查器负责静态语法检查，即在不运行代码的情况下扫描潜在的语法错误，代码异味（Code Smells，即看上去能跑但是代码设计其实很垃圾），安全漏洞以及不符合最佳实践的代码。代码格式化程序负责美化代码排版，比如缩进，空格，换行和括号位置。代码下面如果弹出一堆黄色或红色的波浪线就是在提示这些潜在的错误。

### 数据库（Database）
- **例子** ：MySQL, PostgreSQL, Redis
- **用处** ：数据库是专门用来高效安全地增删改查海量数据的。代码可以通过网络端口向数据仓库发送请求取数据。目前的igem项目应该用不上。

### 容器与虚拟化工具（Container/Virtualization）
- **例子** ：Docker, Docker Desktop, WSL2
- **用处** ：容器工具可以把程序运行所需的系统环境，依赖库，配置文件打包成一个相对独立的运行环境。这样别人在不同电脑上运行项目时，不需要手动安装一堆完全相同的依赖，只要能启动容器，就能尽量复现同样的运行环境。Docker是常见的容器工具；Docker Desktop是Windows/macOS上管理Docker的图形化软件；WSL2则是在Windows上运行Linux环境的基础设施之一，Docker Desktop在Windows上经常会依赖它。容器和前面讲的虚拟环境不太一样：Python的venv/conda主要隔离python包，而Docker更接近隔离一整个程序运行系统环境。

### 编辑器 / 集成开发环境（Editor/IDE）
- **例子** ：vscode (轻量编辑器), PyCharm (Python专属IDE), Visual Studio (C++巨无霸)
- **用处** ：编辑器就是负责写代码的地方，它们通常仍需要调用外部解释器，编译器或运行时。


## 配置的通用流程
一般配置都遵循以下几个步骤，只是面对不同的软件在一些地方可能有所不同。

1. 去官网按照你的系统架构（如何查看见[第二章](#了解你的系统信息)）下载对应版本的软件安装程序/压缩包。可以的话别在百度等广告一堆的搜索引擎搜，容易进的不是官网；
2. 运行安装程序或解压压缩包，注意主动查看和修改安装路径，一般默认c盘，尽量把普通开发软件安装位置统一修改在c盘之外的非系统盘，并且注意路径不要有中文或空格；
3. 安装完成后，顺着路径打开软件的文件夹。一般需要找到的是`bin`文件夹或其他可执行文件所在文件夹，大部分情况下是前者。复制对应`bin`文件夹或者可执行文件所在文件夹的完整路径；
4. 按下`Win + R`键，输入`sysdm.cpl`并按回车打开系统属性。点击“高级”选项卡然后点击“环境变量”。在用户变量那块找到Path（没有的话就自己创建一个）并新建，复制粘贴上一步的路径；（详见[第二章](#环境变量概念辨析)）
5. 确认所有的修改，关闭环境变量设置窗口以及所有涉及的终端和IDE，然后重新打开以刷新设置结果；
6. 验证是否安装了正确的版本，以及设置了正确的位置。打开终端powershell（用户路径前面带PS的就是powershell，不带的话用的是cmd）输入`gcm 工具名`来验证（或者单纯用`工具名 --version`查看是否安装成功），gcm是`Get-Command`指令的缩写。比如：
   ```powershell
   PS C:\Users\17671> gcm git
  CommandType     Name            Version    Source
  -----------     ----            -------    ------
  Application     git.exe         2.46.0.1   D:\Git\Git\cmd\git.exe
   ```
如果 `gcm` 找不到，说明它的可执行程序目录还没有被正确放进环境变量，或者终端没有重启。
7. 进行编辑器配置。我使用的是vscode，配置的内容如下，供参考：

| 语言/工具                | vscode 配置方式                                                                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Python                   | 在vscode的`settings.json`明确指定`"python.defaultInterpreterPath": "D:\\python\\python.exe"`（斜杠要转义所以写两遍），不过一般我都创建新的虚拟环境来指定版本就是了 |
| C/C++                    | C/C++插件自动生成g++构建任务，使用MinGW                                                                                                                            |
| Java（为什么会有它……？） | 系统已配JDK/JAVA_HOME，但因为我不写java所以还没安装java插件                                                                                                        |
| Rust                     | rust-analyzer插件+PATH自动找cargo/rustc                                                                                                                            |
| Node.js                  | 靠PATH和项目配置                                                                                                                                                   |
| CMake                    | CMake命令在PATH                                                                                                                                                    |

## 具体的软件配置

下面的配置教程默认面向Windows 11 x64电脑。其他系统可以参考原理，但不能完全照抄命令。安装包下载时优先选择 `x64`、`x86_64`、`amd64`、`win64` 或 `windows-x64` 版本。主要步骤参考通用流程.

### Git
- Git 官网：https://git-scm.com/
- Windows 下载页：https://git-scm.com/download/win
- GitHub 的安装说明：https://github.com/git-guides/install-git

**安装步骤：**
1. 打开 https://git-scm.com/download/win
2. 下载 `Git for Windows/x64 Setup`。
3. 运行安装程序。
4. 安装路径尽量放到固定开发工具目录，例如 `D:\Git`。
5. 安装选项里大部分直接默认即可。遇到下面几个选项时建议这样选：
   - 默认编辑器：如果有 vscode，可以选 `Use Visual Studio Code as Git's default editor`。
   - PATH 选项：选择 `Git from the command line and also from 3rd-party software`。
   - HTTPS backend：默认即可。
   - Line ending：新手建议选默认的 `Checkout Windows-style, commit Unix-style line endings`。
   - Terminal emulator：默认即可。
6. 一般安装器会自动把git加进path，不需要手动配。如果没有自动加入，就把对应目录加入用户变量的 `Path`：`D:\Git\Git\cmd`（示范）
7. powershell输入`gcm git`验证。
8. 第一次使用git，建议配置用户名和邮箱（邮箱建议使用你github设置的邮箱）：
```powershell
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
git config --global --list
```
9. vscode自带git支持。只要终端里能运行`git --version`，vscode一般就能自动识别。等进入vscode后，左侧面板的Source Control就是对应的git。

**常见问题：**
- 如果 vscode 里 Git 不显示，先彻底关闭 vscode 再重新打开。
- 如果 `git` 命令找不到，检查 `Path` 里有没有 `Git\cmd`。
- Git Bash是git附带的类linux终端，不是必须用，但在Windows上跑一些linux风格命令时很方便。

### vscode
- 下载页：https://code.visualstudio.com/download
- Windows 安装说明：https://code.visualstudio.com/docs/setup/windows

**安装步骤：**
1. 打开 https://code.visualstudio.com/download
2. Windows x64电脑建议下载 `User Installer x64`。
3. 运行安装程序。
4. 安装路径尽量放到固定开发工具目录，例如D盘。vscode不像Docker或Windows SDK那么依赖系统路径，装别的盘通常没问题。
5. 安装选项里建议勾选：
   - `Add to PATH`
   - `Register Code as an editor for supported file types`
   - `Add "Open with Code" action to Windows Explorer file context menu`
   - `Add "Open with Code" action to Windows Explorer directory context menu`
6. 打开，在Extensions安装常用插件：
   - Python：`Python`、`Pylance`、`Python Debugger`
   - C/C++：`C/C++`、`C/C++ Extension Pack`
   - CMake：`CMake Tools`
   - Jupyter：`Jupyter`
   - WSL：`WSL`
   - Docker：`Docker`
   - Remote SSH：`Remote - SSH`
   - Rust：`rust-analyzer`
   - Markdown：`Markdown All in One`、`Markdown Preview Enhanced`
7. 打开vscode设置：在vscode最上方的quick access栏输入`>`或按 `Ctrl + Shift + P`，输入并打开`Preferences: Open User Settings (JSON)`。用户级配置会写在类似这个文件里`C:\Users\你的用户名\AppData\Roaming\Code\User\settings.json`，这个是对所有项目都有效。而工作区设置只对当前项目生效，通常在项目的`.vscode/settings.json`里。如果某个项目需要特殊解释器或编译器，优先用工作区设置，不要污染全局设置。


### Python
- Python 官网：https://www.python.org/
- Windows 下载页：https://www.python.org/downloads/windows/

**安装步骤：**
1. 如果不是明确要做机器学习/生信/数据科学，建议只装一个主力Python，例如Python 3.13。不要一上来装很多版本，否则后面很容易分不清`pip`把包装到了哪里。
2. 打开 https://www.python.org/downloads/windows/
3. 下载 `Windows installer (64-bit)`。
4. 运行安装程序。
5. 勾选`Add python.exe to PATH`。（如果已经有多个Python或使用Anaconda，要知道这会影响默认python环境指向）
6. 可以直接点 `Install Now`，也可以点`Customize installation`自定义安装位置到D盘。
7. 如果安装时勾选了 `Add python.exe to PATH`，通常不用手动加。如果没有勾选，就把下面两个目录加入用户变量 `Path`：
```plain text
D:\python
D:\python\Scripts
```
8. powershell输入`python -m pip --version`验证pip对应哪个版本的Python，它能直接显示当前Python对应的pip路径。再配合`gcm python`和`gcm pip`验证。有多个python时还可以使用`py -0p`列出Windows Python Launcher识别到的所有python版本。
9. 每有新项目就创建虚拟环境，这里是使用python自带的venv创建虚拟环境，还可以用conda创建虚拟环境，见[conda](#anacondaconda)。终端进入你的项目文件夹后运行：
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python --version
pip install requests
pip freeze > requirements.txt
```
10. vscode配置：安装vscode的 `Python` 和 `Pylance` 插件; 打开Python项目文件夹后在vscode最上方的quick access栏输入`>`，输入并打开`Python: Select Interpreter`。如果项目有虚拟环境，选择 `.venv\Scripts\python.exe`。如果只是全局Python，选择你安装的 `python.exe`。理论上你只在终端手动输入指令而不是用vscode的图形化界面的话倒也不必那么麻烦，不过可能会影响到import报错，代码补全等功能，所以不嫌麻烦的话建议设置下。


**常见问题：**
- `python --version` 和vscode右下角显示的 Python 版本可能不一样，因为终端走 `Path`，vscode 运行按钮走当前选择的解释器。
- `pip install` 后vscode仍然提示找不到包，通常是包安装进了另一个 Python 环境。排查时优先按照安装步骤第8步排查。

### Anaconda/Conda
Anaconda 是面向数据科学，机器学习，生信等场景的Python发行版。它有Python，`conda`包管理器，环境管理器和很多科学计算库。

- Anaconda 下载页：https://www.anaconda.com/download
- Conda 文档：https://docs.conda.io/

**是否需要安装：**

- 如果只是写普通python脚本、web后端、小工具，不一定需要Anaconda。
- 如果要用Jupyter、numpy、pandas、scipy、sklearn、biopython、机器学习、生信工具，Anaconda或Miniconda会方便很多。Anaconda会提前帮你装好一堆包，所以会比较重，但是适合新手。清楚自己需要什么包的话理论上安装miniconda/miniforge就行。
- 如果已经装了普通Python，又装Anaconda，一定要分清楚当前项目到底用哪个python。

**安装步骤：**
1. 打开 https://www.anaconda.com/download
2. 下载 Windows x64 安装包。
3. 运行安装程序。
4. 安装范围建议选 `Just Me`。
5. 安装路径可以选D盘。
6. 安装时如果看到 `Add Anaconda to my PATH environment variable`，新手不建议勾选。Anaconda官方安装器通常也不推荐这样做，因为它可能影响你系统里已有的Python。
7. 建议勾选或使用默认的初始化选项，让开始菜单里出现 `Anaconda Prompt`。
8. 刚安装完 Anaconda 后，普通 PowerShell 里不一定能直接识别 `conda`。因此第一次验证请先打开开始菜单里的 `Anaconda Powershell Prompt`，输入`gcm conda`，`gcm python`和`conda info`查看。
9. 如果想让普通的PowerShell以后也能用`conda activate`，先打开`Anaconda Prompt`，运行`conda init powershell`然后关闭powershell和vscode，重新打开（如果报错说禁止运行脚本，那么打开PowerShell，输入并执行`Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`来允许脚本运行）。
10. `conda init powershell`后普通PowerShell可能默认出现`(base)`，问题不大。
11. **创建conda环境** ，这个必须记住，非常常用（install的内容只是举例用）：

```powershell
conda create -n igem python=3.11
conda activate igem
python --version
conda install numpy pandas matplotlib
pip install biopython
```
激活后一般`(base)`会变成`(igem)`，可以以此判断自己是否进入虚拟环境。

12. 可导出环境：

```powershell
conda env export > environment.yml
```

13. 导入别人的环境配置来复现环境：

```powershell
conda env create -f environment.yml
conda activate igem
```

14. vscode配置：先在Anaconda Powershell Prompt或PowerShell里创建并激活环境。打开vscode，打开Python项目文件夹后在vscode最上方的quick access栏输入`>`，输入并打开`Python: Select Interpreter`。选择名称里带有`conda`或环境名的Python，例如`D:\anaconda\envs\igem\python.exe`。


**常见问题：**

- 不要把所有包都装进 `base` 环境。`base` 只当conda的管理环境。
- 不要在没激活环境时乱用`pip install`。
- 如果必须混用`conda`和`pip`，一般先`conda install`，conda没有的包再`pip install`。


### C++/MinGW-w64/MSYS2
电脑里真正要安装的是C++编译器工具链。比较推荐MSYS2 提供的MinGW-w64工具链；它包含`g++`，`gcc`，`gdb`等工具。

- MSYS2 官网：https://www.msys2.org/
- mingw-w64 的 MSYS2 指南：https://www.mingw-w64.org/getting-started/msys2/
- vscode 官方 MinGW 配置教程：https://code.visualstudio.com/docs/cpp/config-mingw

**安装步骤：**

1. 打开 https://www.msys2.org/
2. 下载Windows x64安装器，例如 `msys2-x86_64-xxxx.exe`。
3. 运行安装器。
4. 安装路径建议设置到D盘。
5. 安装完成后，从开始菜单打开MSYS2 UCRT64。在MSYS2 UCRT64终端里更新软件包`pacman -Syu`（如果更新过程中终端自己关闭了，重新打开MSYS2 UCRT64运行相同的指令）。
6. 安装C/C++工具链，如果提示选择安装哪些包，直接按回车使用默认选择：
```bash
pacman -S --needed base-devel mingw-w64-ucrt-x86_64-gcc mingw-w64-ucrt-x86_64-gdb mingw-w64-ucrt-x86_64-make
```

| 工具  | 是什么        | 主要作用                                 | 常见用法                   |
| ----- | ------------- | ---------------------------------------- | -------------------------- |
| `gcc` | C编译器驱动   | 主要编译C代码，也能参与链接              | `gcc main.c -o main.exe`   |
| `g++` | C++编译器驱动 | 主要编译C++代码，自动链接 C++ 标准库     | `g++ main.cpp -o main.exe` |
| `gdb` | 调试器        | 运行时调试程序：断点，单步执行，查看变量 | `gdb main.exe`             |

7. 环境变量设置：把MSYS2的UCRT64的`bin`目录加入用户变量，比如`D:\msys64\ucrt64\bin`。（如果自己在b站等地方下了单独的MinGW-w64工具链，应检查`mingw64\bin`）
8. 关闭所有终端，重新打开PowerShell进行验证：`gcm g++`，`gcm gcc`，`gcm gdb`。
9.  可以写一个测试文件`hello.cpp`：
```cpp
#include <iostream>

int main() {
    std::cout << "Hello C++" << std::endl;
    return 0;
}
```

编译运行来验证是否能正常编译（`g++`说明使用g++编译器，`-o`指定输出文件名）：
```powershell
g++ hello.cpp -o hello.exe
.\hello.exe
```
10. vscode的配置：安装插件`C/C++`和`C/C++ Extension Pack`和`CMake Tools`，然后如果直接使用vscode的C/C++插件提供的Run C/C++ File来运行（或在quick access输入`C/C++: Run C/C++ File`）后会因为是第一次运行而选择编译器。选择带有`g++.exe`的选项即可。vscode会自动生成或记住一个构建任务，通常在`.vscode/tasks.json`里。这样之后运行时就不需要输入上一步的较为繁琐的编译指令。

**常见问题：**
- `g++` 找不到：检查path是否加入了正确的 `bin` 目录。
- 编译能过但运行报缺 DLL：通常是运行时找不到 MSYS2/MinGW 的动态库，确认 `ucrt64\bin` （或`mingw64\bin`）在path里。
- vscode报红但命令行能编译：可能是C/C++插件的IntelliSense配置和真实编译器不一致。可以用`C/C++: Edit Configurations (UI)`检查`compilerPath`。
- MSVC的`cl.exe`是另一套C++工具链，需要Visual Studio Build Tools和Developer Command Prompt；不要和MinGW的`g++`混为一谈。

### Node.js/npm
Node.js是JavaScript运行时，主要用于前端工程，后端服务，脚本工具。`npm`是Node.js默认自带的包管理器。这个igem美工组比较有必要看。

- Node.js官网：https://nodejs.org/
- 下载页：https://nodejs.org/en/download

**安装步骤：**
1. 打开https://nodejs.org/en/download
2. 选择Windows x64。
3. 下载LTS版本安装器。（普通项目建议优先装LTS版本。最新版不一定最稳，因为很多前端项目会指定Node版本。）
4. 运行安装程序。
5. 安装路径尽量选D盘。
6. 安装时保持`Add to PATH`相关选项开启。
7. 如果安装器询问是否安装额外原生编译工具，可以先不勾选；以后遇到需要编译native package的项目再处理。
8. 设置环境变量：一般安装器会自动设置好环境变量。
9. 打开powershell来验证`gcm node`和`gcm npm`。`npm config get prefix`可以查看npm的全局指令位置。
10. 项目使用：在终端进入项目目录后可以对项目进行运行（`npm install`和`npm run dev`），新项目使用`npm init -y`。
11. vscode 配置：Node.js一般不需要在vscode里单独指定解释器。vscode的终端能运行`node --version`和`npm --version`就够了。

**常见问题：**

- `node` 可用但 `npm` 不可用：检查 `D:\nodejs` 和npm prefix目录是否在path。
- 不同项目要求不同Node版本时，建议额外学习`nvm-windows`，不要靠手动卸载重装来切版本。

### pnpm

pnpm 是Node.js生态里的包管理器，作用类似`npm`和`yarn`。它通常更快，更省磁盘空间，并且依赖管理更严格，也是一般我们使用的。安装这个之前得先安装nodejs。安装pnpm前先确认Node.js版本。一般新装Node.js LTS没问题；如果pnpm安装后报版本不兼容，先用`node --version`查看Node版本，再根据pnpm官方兼容表调整Node或pnpm版本。

- pnpm 官网：https://pnpm.io/
- 安装说明：https://pnpm.io/installation


1. 安装方式一：通过npm安装。在powershell使用`npm install -g pnpm`，然后`gcm pnpm`验证（如果`pnpm`找不到，检查npm全局目录是否在path：`npm config get prefix`）。
2. 安装方式二：使用Corepack。部分Node.js版本带有Corepack，可以用它管理pnpm：

```powershell
corepack enable
corepack prepare pnpm@latest --activate
pnpm --version
```

如果`corepack`命令不存在或行为和教程不一致，就用安装方式一即可。

3. 要运行项目的话使用`pnpm install`和`pnpm run dev`。如果项目里已经有 `pnpm-lock.yaml`，优先用 `pnpm install`，不要混用 `npm install`，否则会生成不同的锁文件。
4. vscode配置：pnpm不需要单独配置vscode。只要终端能运行`pnpm --version`就可以在项目里使用。

**常见问题：**

- 同一个项目不要混用 `npm`、`yarn`、`pnpm`。
- 如果项目里有 `package-lock.json`，通常用 npm。
- 如果项目里有 `pnpm-lock.yaml`，通常用 pnpm。
- 如果项目里有 `yarn.lock`，通常用 yarn。

### WSL2
WSL是Windows Subsystem for Linux，可以让你在Windows上运行Linux环境。WSL2是基于轻量虚拟化的新版WSL，兼容性更好，Docker Desktop也常依赖它。不过这玩意儿贼吃硬盘空间，所以注意清理一些之后用不上的编译产物并压缩虚拟磁盘空间（因为默认情况下通常不会自动收缩，可能需要手动压缩或启用Sparse VHD）。安装前提是要win10较新版本或win11。并且需要BIOS/UEFI里启用了虚拟化。一般新电脑默认开启。如果Docker/WSL报虚拟化错误再去BIOS检查。

- WSL 文档：https://learn.microsoft.com/en-us/windows/wsl/
- 安装说明：https://learn.microsoft.com/en-us/windows/wsl/install
- WSL 开发环境建议：https://learn.microsoft.com/en-us/windows/wsl/setup/environment


**安装步骤：**
1. 用管理员身份打开PowerShell，运行`wsl --install`。默认会安装Ubuntu。安装完成后按提示重启电脑。
2. 重新打开powershell检查`wsl -l -v`，显示的Ubuntu版本最好是VERSION 2。
3. 如果不是WSL2，可以运行`wsl --set-default-version 2`和`wsl --set-version Ubuntu 2`来设定指定版本。
4. 要进入ubuntu的话在powershell输入`wsl`即可。第一次进入Ubuntu时会要求设置Linux用户名和密码。这个密码输入时不会显示字符（为了防止有人偷偷看密码？）。
5. 如果要ubuntu内部更新的话就在wsl内输入`sudo apt update`和`sudo apt upgrade`。
6. vscode配置：安装插件 `WSL`。之后可以在终端输入`wsl`来在Ubuntu里进入项目目录运行`code .`（启动vscode，并自动在编辑器中打开当前所在的Linux目录）。vscode会以WSL远程模式打开项目。此时左下角会显示WSL/Ubuntu相关标识。
7. vscode左侧面板的remote explorer也可以进入wsl，通过选择`WSL Targets`可以点开一些常用的文件夹。


**常见问题：**
- Windows 路径类似 `C:\Users\...`。
- WSL Linux 路径类似 `/home/用户名/...`。
- 不建议把需要频繁编译的Linux项目放在`/mnt/c/...`，性能可能不如放在WSL自己的`/home/...`。
- `wsl` 命令不存在：系统版本太旧或 WSL 未启用。
- WSL2 启动失败：检查虚拟化和 `Virtual Machine Platform`。
- vscode 进不去 WSL：确认安装了 `WSL` 插件，并重启 vscode。
- WSL缩水步骤（操作前确认WSL/Docker已关闭，路径必须替换成自己实际的ext4.vhdx）：
  - wsl内删除不需要的文件
  - 关闭wsl并打开powershell找虚拟硬盘文件：
    ```powershell
    wsl --shutdown
    Get-ChildItem -Recurse -Filter "ext4.vhdx" -Path $env:LOCALAPPDATA | Select-Object FullName, Length
    ```
  - 用管理员权限打开powershell输入`diskpart`，之后依次输入以下指令（记得将下面的路径替换为wsl实际路径）[^7]:
    ```diskpart
    select vdisk file="C:\Users\你的用户名\AppData\Local\Packages\Canonical...\LocalState\ext4.vhdx"
    attach vdisk readonly
    compact vdisk
    detach vdisk
    exit
    ```
  - 也可以启用Sparse VHD功能自动回收空间:
    ```powershell
    # 1. 确保wsl是最新版
    wsl --update
    # 2. 查发行版名字
    wsl -l -v
    # 3. 开启稀疏模式 (将 <DistroName> 替换为你的发行版名字，如 Ubuntu-20.04)，需要较新的wsl版本，不行的话就以后手动压缩
    wsl --manage <DistroName> --set-sparse true
    ```

### Docker Desktop
很多项目会提供 `Dockerfile` 或 `docker-compose.yml`，让你不用在本机手动装一堆依赖。安装前建议先安装wsl2。

- Docker 文档：https://docs.docker.com/
- Docker Desktop Windows 安装说明：https://docs.docker.com/desktop/setup/install/windows-install/
- Docker Desktop 下载入口：https://www.docker.com/get-started/


**安装步骤：**
1. 打开 https://www.docker.com/get-started/
2. 下载 `Docker Desktop for Windows - AMD64`。
3. 运行安装器。
4. 安装路径建议使用默认路径。Docker Desktop和系统服务，WSL，虚拟化组件绑定较多，不建议手动搬家。
5. 安装过程中保持`Use WSL 2 instead of Hyper-V`类似选项开启。
6. 安装完成后重启电脑。
7. 打开Docker Desktop，等待左下角或主界面显示Docker Engine正常运行。
8. powershell输入验证`gcm docker`和`docker compose version`。
9. 打开docker desktop，powershell输入`docker run hello-world`来验证docker是否能正常工作（不过如果网络出问题的话也有概率失败）[^6]。
10. vscode配置：安装vscode插件 `Docker`和`Dev Containers`。Docker插件可以查看镜像，容器，日志。Dev Containers可以让vscode直接进入容器内部开发。

**常见问题：**
- `docker` 命令存在，但连接不上 Docker daemon：通常是 Docker Desktop 没启动。
- Docker Desktop 一直启动失败：优先检查 WSL2 和虚拟化。
- 公司/学校网络下拉镜像很慢：可能需要镜像源或代理，这部分不同网络环境差别很大。

### MySQL

MySQL是数据库系统，它由服务端和客户端组成：MySQL Server负责存数据，`mysql.exe`/MySQL Shell/Workbench负责连接和操作数据库。

- MySQL 下载入口：https://www.mysql.com/downloads/
- MySQL Installer for Windows：https://dev.mysql.com/downloads/installer/
- MySQL Workbench：https://dev.mysql.com/downloads/workbench/

**安装步骤：**
1. 打开 https://dev.mysql.com/downloads/installer/
2. 下载 Windows MSI Installer。一般选择体积较大的完整安装包更稳；web 版安装器体积小，但安装时需要联网下载组件。
3. 运行安装器。
4. 安装类型可以选：
   - 只学习数据库：`Developer Default`
   - 只要服务端：`Server only`
   - 想自己选组件：`Custom`
5. 常用组件：
   - `MySQL Server`
   - `MySQL Workbench`
   - `MySQL Shell`
   - `MySQL Router`可选，普通学习通常用不到
6. 安装路径可以放D盘，但MySQL的数据目录、服务配置可能仍会写到系统位置。不要安装完后手动剪切搬家。
7. 配置服务器时：
   - 类型选Development Computer。
   - 端口默认`3306`。
   - 认证方式新项目用默认推荐方式即可。
   - 设置root密码，并记下来。
8. 安装完成后，确认MySQL服务已启动。
9. 环境变量：MySQL Installer不一定会把传统客户端`mysql.exe`加进path。把MySQL Server的`bin`目录（比如`D:\mySQL\mysql_server\bin`，加入后可以终端直接调用）和MySQL Shell（比如`D:\mySQL\mysql_shell\bin`）加入用户变量path。
10. powershell验证`gcm mysql`和`gcm mysqlsh`。
11. 连接数据库用`mysql -u root -p`，然后输入安装时设置的root密码。进入后可以测试诸如以下的内容：

```sql
SHOW DATABASES;
CREATE DATABASE test_db;
SHOW DATABASES;
EXIT;
```

12. 设置Workbench：打开MySQL Workbench，新建连接，Hostname填`localhost`，Port填`3306`，Username填`root`，点击Test Connection，输入密码。


**常见问题：**

- `mysql` 命令找不到：MySQL Server 的 `bin` 没进 `Path`。
- `Access denied`：用户名或密码错。
- `Can't connect to MySQL server`：MySQL 服务没启动，或者端口不是 3306。
- 忘记root密码会比较麻烦，安装时务必记录。

## macOS系统的环境配置（by codex）
如果你使用的是 macOS，整体思路仍然是一样的：先确认自己的芯片是 Intel 还是 Apple Silicon（M 系列芯片），下载软件时对应选择 `Intel/x64` 或 `Apple Silicon/arm64` 版本。macOS 上很多开发工具不会通过图形化环境变量窗口配置，而是通过终端和包管理器完成，最常见的是先安装 Homebrew，然后用 `brew install 软件名` 安装 Git、Python、Node.js、CMake、MySQL 等工具。macOS 的路径写法也和 Windows 不同，比如常见程序路径可能是 `/opt/homebrew/bin`、`/usr/local/bin`，而不是 `D:\xxx\bin`。

需要注意的是，macOS 上的环境变量通常写在 shell 配置文件里，例如 `~/.zshrc`，修改后需要重新打开终端或执行 `source ~/.zshrc` 才会生效。vscode 的使用逻辑和 Windows 类似：先把解释器、编译器、包管理器装好，再在 vscode 里安装对应插件并选择解释器/工具链。不过这篇教程主要还是以 Windows 为准，macOS 用户可以借鉴原理，但具体命令不要完全照抄。


[^1]: 程序的完整构建与执行过程通常包含四个核心阶段：预处理、编译、汇编与链接，最后才进入运行阶段。预处理（preprocessing）是一些针对源码的处理，比如展开头文件 `#include`，删除注释，处理一些条件编译`#ifdef`等等；编译（compilation）即对预处理的源码进行词法分析，语法分析，静态语义分析，中间代码生成，代码优化，目标代码（汇编代码/机器相关代码）生成等等，详细过程请参考课程《编译原理》；汇编（assembly）将汇编代码翻译为机器可以直接理解的指令；链接（linking）将多个目标文件以及所需要的库文件（如标准库）组合成单一的可执行文件，主要需要进行各种内存地址和空间分配以及符号解析；最后的运行需要操作系统读取可执行文件，创建进程，分配系统资源（内存，I/O），并将控制权交给程序的入口（如main函数），最终由CPU执行机器指令。
[^2]: 操作系统（Operating System，OS）负责管理所有硬件和软件资源的系统软件；系统架构（System Architecture）指硬件和软件的底层设计与组织方式（如冯·诺依曼架构），决定了各个部件如何连接、怎样协同处理指令与数据；CPU（处理器）负责解释计算机指令并处理软件中的数据，处理速度快，但一次能处理的任务数量少，主负责串行计算；RAM（内存）用来临时存放CPU正在处理的数据和运行中的程序。它读写速度极快，但断电后数据会丢失。内存越大，你能同时打开的软件就越多；GPU（显卡）专门负责处理图像和图形渲染任务（但其大规模并行计算能力与机器学习的数学运算逻辑高度契合，所以现在GPU也被频繁用在机器学习中，毕竟机器学习本质是对海量数据进行统一而重复的数学计算）。想学习可以阅读csapp。
[^3]: 这里指的不是AMD牌CPU。早年间，Intel统治着32位的PC架构（在此期间的架构被称为x86架构）。 后来要升级到64位时，Intel自己出了一个叫安腾（Itanium）的架构，结果翻车了。反而是它的老对手AMD公司率先研发出了一套完美兼容32位老程序架构的64位扩展标准，并将其命名为AMD64。由于这套标准太成功，Intel后来也不得不向AMD低头，引进了这套技术。
[^4]: 你可能会发现对于一对一的环境变量，编辑窗口会写的用户变量，而对于一对多的环境变量，编辑窗口写的又是环境变量，这可能会给你一种用户变量和环境变量的关系到底是什么的疑惑。 不论是用户变量还是系统变量都是包含在环境变量内的，只是windows的蜜汁命名逻辑可能给人造成误会，所以不需要太纠结名字上的区别，其实全都是环境变量。
[^5]: 有些系统级或重型开发组件与Windows服务，注册表，SDK查找机制和更新器绑定较深，不建议安装后手动搬家，也不建议靠改注册表迁移。安装时如果官方安装器允许选择D盘，可以选择；但Docker Desktop，Visual Studio Build Tools，Windows SDK，.NET SDK这类组件更推荐使用默认路径，后续排错成本最低。
[^6]: 这个验证不需要你有任何配置文件。Docker发现本地没有hello-world镜像后会自动从Docker Hub下载hello-world镜像并创建一个临时容器运行它，正常会输出欢迎信息然后容器退出。
[^7]: 这些指令对应的操作是：首先选择虚拟磁盘文件，然后以只读方式挂载 (防止数据损坏)，之后开始压缩，压缩完成后卸下挂载，最后退出。
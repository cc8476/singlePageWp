const MY_PLUGIN_NAME = "MyReadMePlugin"; // 插件功能：自动生成README文件，标题取自插件option
class MyReadMePlugin {
    constructor(option) {
        this.option = option || {};
    }
    apply(compiler) {

          compiler.plugin("emit", (compilation, asyncCallback) => {
           
            compilation.assets["README.md"] = {
                source: () => {
                    return `# ${this.option.title || '默认标题'}`;
                },
                size: () => 30,
            };
            asyncCallback();
        });
    }
}
module.exports = MyReadMePlugin;
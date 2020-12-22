import { Row, Col } from 'antd';
import ForumApi from '../../../modules/forum/lib/api'
import { withRouter } from 'next/router'
import pageLayout from '../../../components/pagelayout'
import { Comment, Avatar, Form, Button, List, Input } from 'antd';
import { Typography, Space } from 'antd';
import remark from 'remark'
import html from 'remark-html'


const { Text, Link } = Typography;
class TopicList extends React.Component {
    constructor({query})
    {
        super();
        this.api = new ForumApi();
        this.state = {loaded:false};
    }
    async componentDidMount() {
        
        var topicdata = await this.api.getPostList(this.props.query.slug);
        if (topicdata)
        {
            var retval = []
            var arrayLength = topicdata.length;
            for (var i = 0; i < arrayLength; i++) {
                //Do something
                var processedContent = await remark().use(html).process(topicdata[i].text);
                var contentHtml = processedContent.toString();
                retval.push({'user':topicdata[i].user,'text':contentHtml,'timestamp':topicdata[i].timestamp});
            }
            console.log("TOPICDATA");
            console.log(retval);
            this.setState({topicdata: retval,loaded:true});
            
        }
    }
    timeConverter(UNIX_timestamp){
        var a = new Date(UNIX_timestamp * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
        return time;
      }
	render() {
        const options = {
            lineWrapping: true,
            // TODO: show vim key buffer and current mode (always visible at bottom)
            //   https://codemirror.net/demo/vim.html
            // TODO: allow vim mode to be toggled on/off through UI
            //keyMap: "vim", // https://codemirror.net/doc/manual.html#vimapi

            //mode: 'hypermd',
            // mode: 'gfm',
            //theme: 'hypermd-light',

            hmdFold: {
              image: true,
              link: true,
              math: true,
            },
            hmdHideToken: true,
            hmdCursorDebounce: true,
            hmdPaste: true,
            hmdClick: true,
            hmdHover: true,
            hmdTableAlign: true,
        };
        return (
            <>
                Forum Topic
                <div id="uniq">
                {(this.state && this.state.loaded) ? (this.state.topicdata.map((value,index) => {
                    console.log("Newval: " + value);
                    return (
                        <Row style={{padding: "5px"}} gutter={[16, 24]}  justify="center">
                            <Col style={{"borderRadius":"1px","border":"1px solid black"}} span={12}>
                                <Row>
                                    <Col span={4}>User: {value.user ? value.user.name : 'NoUser'}</Col>
                                    <Col span={8}>
                                        <Row>
                                            <Col>
                                            <div dangerouslySetInnerHTML={{__html: value.text}}></div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col><Text type="secondary">Posted {this.timeConverter(value.timestamp)}</Text></Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    );
                })) : (<></>)}
                </div>
                <div id="postpost">
                    Post new post content here
                </div>
            </>
        )
	}
}
export default withRouter(TopicList);
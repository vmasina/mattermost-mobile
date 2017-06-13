// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
    Dimensions,
    StyleSheet,
    View
} from 'react-native';
import {KeyboardAccessoryView} from 'react-native-keyboard-input'; //eslint-disable-line

import KeyboardLayout from 'app/components/layout/keyboard_layout';
import PostList from 'app/components/post_list';
import PostTextbox from 'app/components/post_textbox';
import StatusBar from 'app/components/status_bar';
import {makeStyleSheetFromTheme} from 'app/utils/theme';

export default class Thread extends PureComponent {
    static propTypes = {
        actions: PropTypes.shape({
            handleCommentDraftChanged: PropTypes.func.isRequired,
            selectPost: PropTypes.func.isRequired
        }).isRequired,
        channelId: PropTypes.string.isRequired,
        navigator: PropTypes.object,
        myMember: PropTypes.object.isRequired,
        files: PropTypes.array,
        rootId: PropTypes.string.isRequired,
        draft: PropTypes.string.isRequired,
        theme: PropTypes.object.isRequired,
        posts: PropTypes.array.isRequired
    };

    state = {
        keyboardAccessoryViewHeight: 64
    };

    componentWillReceiveProps(nextProps) {
        if (!this.state.lastViewedAt) {
            this.setState({lastViewedAt: nextProps.myMember.last_viewed_at});
        }
    }

    componentWillUnmount() {
        this.props.actions.selectPost('');
    }

    handleDraftChanged = (value) => {
        this.props.actions.handleCommentDraftChanged(this.props.rootId, value);
    };

    keyboardAccessoryViewContent = () => {
        const {channelId, draft, files, navigator} = this.props;

        return (
            <PostTextbox
                ref={this.attachPostTextbox}
                files={files}
                value={draft}
                channelId={channelId}
                onChangeText={this.handleDraftChanged}
                navigator={navigator}
            />
        );
    };

    keyboardAccessoryHeightChanged = (height) => {
        this.setState({keyboardAccessoryViewHeight: height});
    };

    render() {
        const {myMember, navigator, posts, theme} = this.props;
        const style = getStyle(theme);
        const {keyboardAccessoryViewHeight} = this.state;
        const {height: deviceHeight, width: deviceWidth} = Dimensions.get('window');

        return (
            <View>
                <StatusBar/>
                <KeyboardLayout
                    behavior='padding'
                    style={[style.container, {height: deviceHeight - keyboardAccessoryViewHeight, width: deviceWidth}]}
                    keyboardVerticalOffset={0}
                >
                    <PostList
                        indicateNewMessages={true}
                        posts={posts}
                        currentUserId={myMember.user_id}
                        lastViewedAt={this.state.lastViewedAt}
                        navigator={navigator}
                    />
                </KeyboardLayout>

            </View>
        );
    }
}

const getStyle = makeStyleSheetFromTheme((theme) => {
    return StyleSheet.create({
        container: {
            backgroundColor: theme.centerChannelBg
        }
    });
});

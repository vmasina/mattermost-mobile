// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {selectPost} from 'mattermost-redux/actions/posts';
import {getPostIdsInCurrentChannel} from 'mattermost-redux/selectors/entities/posts';
import {getCurrentChannelId, getMyCurrentChannelMembership, makeGetChannel} from 'mattermost-redux/selectors/entities/channels';
import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';
import {loadPostsIfNecessaryWithRetry, loadThreadIfNecessary, increasePostVisibility, refreshChannelWithRetry} from 'app/actions/views/channel';
import {getTheme} from 'app/selectors/preferences';

import ChannelPostList from './channel_post_list';

function makeMapStateToProps() {
    const getChannel = makeGetChannel();

    return function mapStateToProps(state) {
        const channelId = getCurrentChannelId(state);
        const channelRefreshingFailed = state.views.channel.retryFailed;
        const channel = getChannel(state, {id: channelId}) || {};

        return {
            channelId,
            channelRefreshingFailed,
            currentUserId: getCurrentUserId(state),
            channelType: channel.type,
            channelDisplayName: channel.display_name,
            postIds: getPostIdsInCurrentChannel(state),
            postVisibility: state.views.channel.postVisibility[channelId],
            lastViewedAt: getMyCurrentChannelMembership(state).last_viewed_at,
            totalMessageCount: channel.total_msg_count,
            theme: getTheme(state)
        };
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            loadPostsIfNecessaryWithRetry,
            loadThreadIfNecessary,
            increasePostVisibility,
            selectPost,
            refreshChannelWithRetry
        }, dispatch)
    };
}

export default connect(makeMapStateToProps, mapDispatchToProps)(ChannelPostList);

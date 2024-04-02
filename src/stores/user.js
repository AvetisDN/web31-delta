import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { supabase } from "../supabase";
import { useRouter } from "vue-router";
import { getTime } from "../helper/utility";

export const useUserStore = defineStore("user", () => {
  const user = ref(null);
  const profile = ref(null);

  // USER AUTH
  async function register(email, password, username) {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });
    if (error) {
      throw error;
    }
    if (user) {
      await getUserProfile(user.id);
    }
  }
  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw error;
    }
    if (data.user) {
      await getUserProfile(data.user.id);
    }
  }
  async function loginWithProvider(provider) {
    const { data, error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
      throw error;
    }
  }
  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    user.value = null;
    profile.value = null;
  }
  async function getUserProfile(id) {
    let { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      throw error;
    }
    if (data) {
      profile.value = data;
    }
  }
  function setUserState(userObject) {
    user.value = userObject;
    if (userObject) getUserProfile(userObject.id);
  }
  function isUser() {
    return !!user.value;
  }

  const router = useRouter();

  watch(user, () => {
    if (!user.value) {
      router.push("/landing");
    }
  });

  // TWEETs GETTERS
  const tweets = ref([]);
  const ownTweets = ref([]);
  const followings = ref([]);
  const followingTweets = ref([]);

  const getTweetById = (id) => tweets.value.find((tweet) => tweet.id === id);
  const getAllFolowingId = () =>
    followings.value.map((following) => following.id);
  const getFolowingById = (id) =>
    followings.value.find((following) => following.id === id);

  const isTweetLiked = (id) => profile.value.liked_tweet_id.includes(id);
  const isTweetRetweeted = (id) =>
    profile.value.retweeted_tweet_id.includes(id);

  const getTotalRepliedById = (id) => {
    const tweet = tweets.value.find((tweet) => tweet.id === id);
    return tweet.replied_user_id.length;
  };
  const getTotalRetweetedById = (id) => {
    const tweet = tweets.value.find((tweet) => tweet.id === id);
    return tweet.retweeted_user_id.length;
  };
  const getTotalLikedById = (id) => {
    const tweet = tweets.value.find((tweet) => tweet.id === id);
    return tweet.liked_user_id.length;
  };

  const getAllTweetsWithMedia = (id) =>
    tweets.value.filter((tweet) => tweet.media !== null);

  const getAllLikedTweets = (id) =>
    tweets.value.filter((tweet) =>
      profile.value.liked_tweet_id.includes(tweet.id)
    );

  // TWEETs ACTIONS

  const getFollowingProfile = async (idArray) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .in("id", idArray);
    if (error) throw error;
    if (data) followings.value = data;
  };

  const getFolowings = async () => {
    const { data, error } = await supabase
      .from("followings")
      .select("followingId")
      .eq("userId", user.value.id);
    if (error) throw error;
    if (data) {
      const idArray = [];
      for (const item of data) {
        idArray.push(item.followingId);
      }
      await getFollowingProfile(idArray);
    }
  };

  const getOwnTweets = async () => {
    const { data, error } = await supabase
      .from("tweets")
      .select("*")
      .eq("userId", user.value.id);
    if (error) throw error;
    if (data) {
      data.sort((a, b) => {
        const aTimestamp = new Date(a.created_at);
        const bTimestamp = new Date(b.created_at);
        return bTimestamp - aTimestamp;
      });
      ownTweets.value = data.map((item) => ({
        ...item,
        avatar_url: profile.value.avatar_url,
        username: profile.value.username,
        full_name: profile.value.full_name,
      }));
    }
  };

  const getFollowingTweets = async () => {
    const { data, error } = await supabase
      .from("tweets")
      .select("*")
      .in("userId", getAllFolowingId());
    if (error) throw error;
    if (data) {
      followingTweets.value = data.map((item) => ({
        ...item,
        avatar_url: getFolowingById(item.userId).avatar_url,
        username: getFolowingById(item.userId).username,
        full_name: getFolowingById(item.userId).full_name,
      }));
    }
  };

  const getTweetsByTimeline = async () => {
    await getFolowings();
    await getOwnTweets();
    await getFollowingTweets();
    const arr = ownTweets.concat(followingTweets);
    arr.sort((a, b) => {
      const aTimestamp = new Date(a.created_at);
      const bTimestamp = new Date(b.created_at);
      return bTimestamp - aTimestamp;
    });
    tweets.value = arr;
  };

  const sendTweet = async (tweet, media) => {
    const { data, error } = await supabase.from("tweets").insert([
      {
        userId: user.value.id,
        tweet,
        media: media ? media : null,
        createdTime: getTime(),
      },
    ]);
    if (error) throw error;
    if (data) {
      getTweetsByTimeline();
    }
  };

  const storeMediaAndReturnPath = async (file) => {
    const fileName = Date.now() + "_" + file.name;
    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, file);
    if (uploadError) throw uploadError;
    const { publicURL, error: pathError } = supabase.storage
      .from("images")
      .getPublicUrl(fileName);
    if (pathError) throw pathError;
    if (publicURL) return publicURL;
    return null;
  };

  const addLikeInUser = async (tweet_id) => {
    const arr = profile.value.liked_tweet_id;
    arr.push(tweet_id);
    const { data, error } = await supabase
      .from("profiles")
      .update({ liked_tweet_id: arr })
      .match({ id: profile.value.id });
    if (error) throw error;
    if (data) getUserProfile(user.value.id);
  };
  const addLikeInTweet = async (tweet_id) => {
    const tweet = tweets.value.find((item) => item.id === tweet_id);
    let arr = tweet.liked_user_id;
    arr.push(profile.value.id);
    const { data, error } = await supabase
      .from("tweets")
      .update({ liked_tweet_id: arr })
      .match({ id: tweet_id });
    if (error) throw error;
    if (data) getTweetsByTimeline();
  };
  const cancelLikeInUser = async (tweet_id) => {
    const arr = profile.value.liked_tweet_id.filter(
      (item) => item !== tweet_id
    );
    const { data, error } = await supabase
      .from("profiles")
      .update({ liked_tweet_id: arr })
      .match({ id: profile.value.id });
    if (error) throw error;
    if (data) getUserProfile(user.value.id);
  };
  const cancelLikeInTweet = async (tweet_id) => {
    const tweet = tweets.value.find((item) => item.id === tweet_id);
    let arr = tweet.liked_user_id;
    arr = arr.filter((item) => item !== profile.value.id);

    const { data, error } = await supabase
      .from("tweets")
      .update({ liked_tweet_id: arr })
      .match({ id: tweet_id });
    if (error) throw error;
    if (data) getTweetsByTimeline();
  };

  const addRetweetInUser = async (tweet_id) => {
    const arr = profile.value.retweeted_tweet_id;
    arr.push(tweet_id);
    const { data, error } = await supabase
      .from("profiles")
      .update({
        retweeted_tweet_id: arr,
      })
      .match({ id: profile.value.id });
    if (error) throw error;
    if (data) getUserProfile(user.value.id);
  };
  const addRetweetInTweet = async (tweet_id) => {
    const tweet = tweets.value.find((item) => item.id === tweet_id);
    const arr = tweet.retweeted_user_id;
    if (tweet.userId === user.value.id) {
      arr.push(tweet_id);
    } else {
      const newTweet = await insertRetweet(tweet);
      arr.push(newTweet[0].id);
    }
    const { data, error } = await supabase
      .from("tweets")
      .update({
        retweeted_user_id: arr,
      })
      .match({ id: tweet_id });
    if (error) throw error;
    if (data) getTweetsByTimeline();
  };

  const cancelRetweetInUser = async (tweet_id) => {
    const arr = profile.value.retweeted_tweet_id.filter(
      (item) => item !== tweet_id
    );
    const { data, error } = await supabase
      .from("profiles")
      .update({
        retweeted_tweet_id: arr,
      })
      .match({ id: profile.value.id });
    if (error) throw error;
    if (data) getUserProfile(user.value.id);
  };
  const cancelRetweetInTweet = async (tweet_id, original_tweet_id) => {
    const original_tweet = tweets.find((item) => item.id === original_tweet_id);
    const arr = original_tweet.retweeted_user_id.filter(
      (item) => item !== tweet_id
    );
    const { data, error } = await supabase
      .from("tweets")
      .update({
        retweeted_user_id: arr,
      })
      .match({ id: tweet_id });
    if (error) throw error;
    if (original_tweet.userId === user.value.id) {
      if (data) getTweetsByTimeline();
    } else {
      if (data) deleteRetweet(tweet_id);
    }
  };

  const insertRetweet = async (tweet) => {
    const time = getTime();
    const { data, error } = await supabase.from("tweets").insert([
      {
        userId: user.value.id,
        original_tweet_id: tweet.id,
        createdTime: time,
      },
    ]);
    if (error) throw error;
    if (data) return data;
  };
  const deleteRetweet = async (tweet_id) => {
    const { data, error } = await supabase
      .from("tweets")
      .delete()
      .eq("id", tweet_id);
    if (error) throw error;
    if (data) getTweetsByTimeline();
  };

  return {
    user,
    profile,
    login,
    logout,
    loginWithProvider,
    getUserProfile,
    register,
    setUserState,
    isUser,
    followings,
    tweets,
    followingTweets,
    ownTweets,
    getTweetById,
    getAllFolowingId,
    getAllLikedTweets,
    getAllTweetsWithMedia,
    getTotalLikedById,
    getTotalRepliedById,
    getTotalRetweetedById,
    getFolowingById,
    isTweetLiked,
    isTweetRetweeted,
    getFollowingProfile,
    getFolowings,
    getOwnTweets,
    getFollowingTweets,
    getTweetsByTimeline,
    sendTweet,
    storeMediaAndReturnPath,
    addLikeInTweet,
    addLikeInUser,
    cancelLikeInTweet,
    cancelLikeInUser,
    addRetweetInTweet,
    addRetweetInUser,
    cancelRetweetInTweet,
    cancelRetweetInUser,
  };
});

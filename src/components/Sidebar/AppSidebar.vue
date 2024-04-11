<script setup>
import IconBookmark from "../Icons/IconBookmark.vue";
import IconExplore from "../Icons/IconExplore.vue";
import IconHome from "../Icons/IconHome.vue";
import IconList from "../Icons/IconList.vue";
import IconMessage from "../Icons/IconMessage.vue";
import IconMore from "../Icons/IconMore.vue";
import IconNotification from "../Icons/IconNotification.vue";
import IconProfile from "../Icons/IconProfile.vue";
import ButtonTweet from "./ButtonTweet.vue";
import ButtonSelf from "./ButtonSelf.vue";
import Logo from "../Logo.vue";

const menuItems = [
  {
    title: "Home",
    path: "/home",
    icon: IconHome,
  },
  {
    title: "Explore",
    path: "/explore",
    icon: IconExplore,
  },
  {
    title: "Notifications",
    path: "/messages",
    icon: IconMessage,
  },
  {
    title: "Messages",
    path: "/notifications",
    icon: IconNotification,
  },
  {
    title: "Bookmarks",
    path: "/bookmarks",
    icon: IconBookmark,
  },
  {
    title: "Lists",
    path: "/lists",
    icon: IconList,
  },
  {
    title: "Profile",
    path: "/profile",
    icon: IconProfile,
  },
  {
    title: "More",
    path: "/home",
    icon: IconMore,
  },
];
</script>

<template>
  <div
    class="flex flex-col items-start gap-4 justify-between min-h-screen p-4 xl:p-6 fixed min-w-56"
  >
    <div class="flex flex-col gap-6">
      <Logo />
      <div class="flex flex-col gap-4">
        <router-link
          v-for="item of menuItems"
          :to="item.path"
          class="text-lg font-medium flex gap-2 items-center hover:text-teal-500"
        >
          <div class="w-5 flex justify-center">
            <component :is="item.icon" class="h-4" />
          </div>
          {{ item.title }}
        </router-link>
      </div>
      <ButtonTweet />
    </div>
    <ButtonSelf />
  </div>
</template>

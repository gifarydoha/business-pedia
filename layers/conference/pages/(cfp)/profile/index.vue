<script setup lang="ts">
definePageMeta({ layout: "conference" });
useSeoMeta({ title: "My Profile" });

const user = {
  name: "Dr. Amara Osei",
  email: "amara.osei@northsouth.edu",
  userId: "USR-2023-04817",
  affiliation: "North South University, Dhaka",
  country: "Bangladesh",
  bio: "Associate Professor of Economics with a focus on social business frameworks, microfinance, and SDG-aligned enterprise models in developing economies. Active researcher and peer reviewer for SBAC since 2019.",
  avatarInitials: "AO",
  joined: "March 2021",
  papers: 3,
  track: "Finance & the SDGs",
};
</script>

<template>
  <div>
    <CfpSharedBreadcrumb :crumbs="[{ label: 'My Profile' }]" />

    <div class="mx-auto max-w-3xl px-6 py-10 md:py-12">
      <h1 class="mb-6 font-lora text-2xl font-bold text-cfp-olive md:text-3xl">
        My Profile
      </h1>

      <ProfileCard v-bind="user" />
    </div>
  </div>
</template>

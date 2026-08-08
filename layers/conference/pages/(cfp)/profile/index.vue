<script setup lang="ts">
definePageMeta({ layout: "conference" });
useSeoMeta({ title: "My Profile" });

const user = {
  name: "Dr. Amara Osei-Bonsu",
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

    <div class="mx-auto max-w-4xl px-6 py-12 md:py-16">
      <!-- Page title -->
      <div class="mb-8">
        <span class="font-poppins text-xs font-semibold tracking-widest text-cfp-yellow uppercase">
          Account
        </span>
        <h1 class="mt-1 font-lora text-3xl font-bold text-cfp-olive md:text-4xl">
          My Profile
        </h1>
      </div>

      <ProfileProfileCard v-bind="user" />
    </div>
  </div>
</template>

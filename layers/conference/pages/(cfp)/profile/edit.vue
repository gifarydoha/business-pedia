<script setup lang="ts">
definePageMeta({ layout: "conference" });
useSeoMeta({ title: "Edit Profile" });
</script>

<template>
  <div>
    <CfpSharedBreadcrumb
      :crumbs="[
        { label: 'My Profile', href: '/profile' },
        { label: 'Edit Profile' },
      ]"
    />

    <!-- Page header -->
    <div class="bg-cfp-olive">
      <div class="mx-auto flex max-w-4xl items-center gap-5 px-6 py-12 md:py-16">
        <div>
          <span class="font-poppins text-xs font-semibold tracking-widest text-cfp-yellow uppercase">
            Account
          </span>
          <h1 class="mt-1 font-lora text-3xl font-bold text-white md:text-4xl">
            Edit Profile
          </h1>
        </div>
      </div>
    </div>

    <ProfileProfileEditForm />
  </div>
</template>

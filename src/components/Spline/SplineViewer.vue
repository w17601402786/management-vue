<template>
  <div class="col-md-6 d-flex justify-content-center align-items-center" style="overflow: hidden !important; border: 1px solid #ccc; border-radius: 10px; padding: 0px;">
    <spline-viewer class="spline-viewer" :url="splineUrl"></spline-viewer>
  </div>
</template>

<script>
import SplineViewer from '@/assets/3d/spline-viewer.js';

export default {
  name: 'SplineViewer',
  components: {
    SplineViewer,
  },
  data() {
    return {
      splineUrl: '@/assets/3d/scene.splinecode',
    };
  },
};
</script>

<style>
/* Add any necessary styles here */
</style>
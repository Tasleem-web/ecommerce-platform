<template>
  <div class="row justify-content-center">
    <div class="col-12 col-sm-8 col-md-6 col-lg-6">
      <div class="card shadow border-0 rounded-3">
        <div class="card-body p-4 p-sm-5">
          <div class="text-center mb-4">
            <h3 class="fw-bold text-dark mb-2">Create an account</h3>
            <p class="text-muted small">Please sign up to your account</p>
          </div>

          <form @submit.prevent="registerUser">
            <div class="mb-3">
              <label for="nameInput" class="form-label text-secondary small fw-semibold">Full Name</label>
              <input
                v-model="formData.name"
                type="text"
                class="form-control form-control-lg fs-6"
                id="nameInput"
                placeholder="Your full name"
                required
              />
            </div>

            <div class="mb-3">
              <label for="emailInput" class="form-label text-secondary small fw-semibold">Email address</label>
              <input
                v-model="formData.email"
                type="email"
                class="form-control form-control-lg fs-6"
                id="emailInput"
                placeholder="name@example.com"
                required
              />
            </div>

            <div class="mb-3">
              <label for="genderInput" class="form-label text-secondary small fw-semibold">Gender</label>
              <select
                v-model="formData.gender"
                id="genderInput"
                class="form-select form-select-lg fs-6"
                required
              >
                <option value="" disabled>Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="mb-3">
              <label for="passwordInput" class="form-label text-secondary small fw-semibold">Password</label>
              <input
                v-model="formData.password"
                type="password"
                class="form-control form-control-lg fs-6"
                id="passwordInput"
                placeholder="••••••••"
                required
              />
            </div>

            <div class="mb-3">
              <label for="confirmPasswordInput" class="form-label text-secondary small fw-semibold">Confirm Password</label>
              <input
                v-model="formData.confirmPassword"
                type="password"
                class="form-control form-control-lg fs-6"
                id="confirmPasswordInput"
                placeholder="••••••••"
                required
              />
            </div>

            <div class="mb-3">
              <label for="avatarInput" class="form-label text-secondary small fw-semibold">Profile Image</label>
              <input
                ref="imageInput"
                @change="onFileChange"
                type="file"
                accept="image/*"
                class="form-control form-control-lg fs-6"
                id="avatarInput"
              />
            </div>

            <button type="submit" class="btn btn-primary btn-lg w-100 fs-6 mb-3" :disabled="loading">
              {{ loading ? 'Creating account...' : 'Sign Up' }}
            </button>
          </form>

          <div class="text-center">
            <span class="text-muted small">Have an account?</span>
            <router-link class="nav-link" :to="{ name: 'Login' }"> Sign In </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserApi from '@/apis/User';

export default {
  name: 'RegisterComponent',
  data() {
    return {
      loading: false,
      formData: {
        name: '',
        email: '',
        gender: '',
        password: '',
        confirmPassword: '',
        imageFile: null,
      },
    };
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files && event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        this.formData.imageFile = file;
      } else {
        this.formData.imageFile = null;
      }
    },
    readFileAsDataUrl(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    },
    compressImageFile(file, { maxWidth = 1200, maxHeight = 1200, quality = 0.75 } = {}) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;

          img.onload = () => {
            let width = img.width;
            let height = img.height;

            if (width > maxWidth || height > maxHeight) {
              if (width > height) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
              } else {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error('Unable to get canvas context'));
              return;
            }
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve(blob);
                } else {
                  reject(new Error('Canvas compression returned no blob'));
                }
              },
              'image/jpeg',
              quality,
            );
          };

          img.onerror = reject;
        };

        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    },
    async registerUser() {
      if (this.formData.password !== this.formData.confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      this.loading = true;
      try {
        let imageUrl = undefined;

        if (this.formData.imageFile) {
          const compressedBlob = await this.compressImageFile(this.formData.imageFile, {
            maxWidth: 1200,
            maxHeight: 1200,
            quality: 0.75,
          });

          const compressedDataUrl = await this.readFileAsDataUrl(compressedBlob);
          const uploadResult = await UserApi.uploadImageBuffer(compressedDataUrl, 'user_profiles');
          imageUrl = uploadResult.data?.url || uploadResult.data?.secure_url;
        }

        await UserApi.register({
          name: this.formData.name,
          email: this.formData.email,
          gender: this.formData.gender,
          password: this.formData.password,
          image: imageUrl,
        });

        this.$router.push({ name: 'Login' });
      } catch (err) {
        console.error(err);
        alert('Registration failed. Please try again.');
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped></style>

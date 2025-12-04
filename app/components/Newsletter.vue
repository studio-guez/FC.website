<template>
    <section class="v-inscription"
    >
      <form method="post"
            action="https://newsletter.infomaniak.com/v3/api/1/newsletters/webforms/18211/submit"
            class="inf-form"
            target="_blank"
            @submit="onSubmit">
        <input type="email" name="email" style="display:none"/>
        <input type="hidden" name="key"
               value="eyJpdiI6ImRuVGpEVEpRSGFqTFNXSGFDRk5CQks4XC9PSkhSb2pxc1UxYzlLTmFvTFR3PSIsIm1hYyI6ImVhOTgzNDIxZjhhMmU3OTBiNWVhYzcwOTFkN2Y1OTU3MWNmMjZjODkzZDljZTU1MjQ3YzE3ZWU4NWVhMDljMTYiLCJ2YWx1ZSI6IllzQjZjU2hxSzJtWVo3RE9NTWpiRXhqcTBBOWZRYnRNdmpTOG5RYmFNM289In0=">
        <input type="hidden" name="webform_id" value="18211">
        <div class="inf-main_4186b8943907012bd947930996fe9051"><h4></h4> <span></span>
          <div class="inf-success" v-if="success">
            <p>Votre inscription a été enregistrée avec succès !</p>
          </div>
          <div class="inf-content">
            <div class="inf-input inf-input-text">
              <input type="email" name="inf[1]" data-inf-meta="1" data-inf-error="" required="required" placeholder="Adresse email*">
            </div>
            <div class="container">
              <div class="recaptcha-container">
                <label for="mcaptcha__token" id="mcaptcha__token-label"
                data-mcaptcha_url="https://captcha.infomaniak.com/widget/?sitekey=wKJaAigS1e48fWgqtjvg5w7rKA6QIwmy">
                  <input type="text" name="mcaptcha__token" id="mcaptcha__token"/>
                </label>
                <div id="mcaptcha__widget-container"></div>
                <component is="script" src="https://unpkg.com/@mcaptcha/vanilla-glue@0.1.0-rc2/dist/index.js"></component>
              </div>
              <div class="inf-submit">
                <button type="submit" name="">Envoyer </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'

const success = ref(false);

const props = defineProps<{
    message?: string
}>()

function onSubmit(e) {
  success.value = true;
}
</script>





<style lang="scss" scoped >
  input[type="email"] {
    width: 100%
  }

  button {
    cursor: pointer;
  }

  button:hover {
    opacity: 0.6;
  }

  input, label, button {
    border: none;
    background: none;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    color: inherit;
    overflow: visible;
  }

  input:focus {
    outline: none;
  }

  input::placeholder {
    color: inherit;
    opacity: 0.35;
  }

  .inf-input {
    border: 0.1em solid;
    padding: 0.5em;
    border-radius: 10px;
    margin-bottom: 0.65rem;
  }

  .recaptcha-container {
    overflow: hidden;
    width: 10rem;
  }

  #mcaptcha__widget-container {
    height: 2rem;
    margin-left: -0.3rem;
    width: 18rem;
  }

  .container {
    display: flex;
    align-items: center;;
    justify-content: space-between;
  }

</style>

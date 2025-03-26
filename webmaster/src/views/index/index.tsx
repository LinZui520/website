import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IndexView',
  setup() {
    return () => (
      <div>
        {[1, 2, 10].map((item) => (
          <p key={item}>
            item
          </p>
        ))}
      </div>
    );
  }
});

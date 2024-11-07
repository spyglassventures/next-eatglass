// utils/doctorUtils.ts

//  Image for vcf
export const imageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA7AAAAOwBeShxvQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAR9SURBVFiFvZZfbFN1FMc/53dv29tu3b8AUSGEBDY1giCPPolBYjQYg4BkTh4gShREtgls42F7IDwYBMMfxUQxUYwRoxgwxpgQfBDxQTEgGIPKhmAmEDaga9fe9t7jw1w31na0rPE8Nb/fOd/v557fr/ce4Q7Ce7X9XXHdJg0FbaKVvVhywFQEtsrGjXHt6rJ9CbWirAamAxcR2WU6N+8RRMdqScnm6zb9JMnUfOqq0Ug4u65wwiK1UAl9rPBUntKPrK72pgkBaHPbyxpL7lUnCJNq86XEgYqC9cISu7P90Og1UwqA7/ovgCJOsFBKQXMAUV0+dq0kAKByqMrK2fDqZ5Fo3YC7aGFhAKR6QgBiyVkAzWRy9rSyEnUc/Oocj5EcOD12zS4JIOg1a9Islvig0coIGIPXUE9q8ZNocOhYvIZ6Eq0bsM7+Sujrb0aXxwzy1ljN0jqwfXu3REJrUF+5dh1U0VAQdRwwI1LqOBByRpemVORZ6Wr7K0ezFICsQUtHk8YSHxC0RSfVoeEwmYfm4T76CKanB+fzLxA3DZ4H4Cq6zO7qOJxPq9RLOES9Y9sBiUZW4mZUrvYjg4OYGzeGBG8OIIPJEXORpYXM4Q47MBzZTgQColPq8KtrkEQcSadHzDvbjoz7MBMByIGYXAsiRZuXBSAPhKvGFGVe1tCWjlX+i80ZbdnS8r8aTzTKcgTFhv74zt2aSHwm+PdTVbNE5q0+VtKbEEC/2/MYlj8fO/oLNbGjUr8+ddsaPWjxQ+8+vdm/SkJhoxV1qGUtBY4V3QE9sWszbqoTY4e1ogbsAEBC4UuDHAbc/zIHsIJH5YHlLoB+v2sNrvsGllRoRd1w3d+CWSgPNv5WFIAef/MQycTTRKrQiprb58N+E7uxDy91ED8zQytrIZgdXr4VMStkTuNlKHAHulWdUJpl9wTlQz2+eyvJ2BZCEbRq0kiSnwHfz+OuyEBfBt+3NBwVwtHhd4OqssP0TW2TBQuyn9Nb7sCm7swnHjLTTupkD50+cP3KVE7u7wBQ59ZZQ+I3IePmAohAwLE1UjV6bogJstrMfe7TnPThHxvPpw/2eSy7KyA8HIXZEaHaiEZ+/0oCl09TbPvzEJ0T9Z6RuSvP5Nu1ADZ3u+9d86QJgfscIeZB0ocaGzGTG7DSCaz+HrBssAuOY/nisLjBJ2R+48VCCTaAbaxTgoevgqdgBC4N3WHmRIBZi4gAgd6TKIAz7ugH4AmyhTmNr4vkjuKjI3sE7RfcDVdddkYt4V5HshvTQjA7LFTbQqTnWDzQ+3NSo7XnsEPxPHq+KueNpftk9vOnbkd5CwBAR4+39krG3x01SIMj2WFhBMKoBWujQXm7GPGSAYqBqAkYz7KZVinyTzkAciaibTOsvVNs80rMR88lleF/+qUUnBlUjXv+++UyzwuQhRBtjXnKGAg50qeeqpbtIzauUMefbvMVnx1RSxh1HP1p36pfN02ulQNg3KF028zgzikW64ePQ5HrvviPl8u86Gjv8V576Y90uutCamm5tf8FVmDUaJqTwesAAAAASUVORK5CYII=';

// Sanitize filename properly for saving VCF files
export const sanitizeFileName = (name: string) => {
    return name
        .normalize('NFD') // Decompose accents from characters
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks (accents)
        .replace(/[äÄ]/g, 'ae')
        .replace(/[öÖ]/g, 'oe')
        .replace(/[üÜ]/g, 'ue')
        .replace(/[ß]/g, 'ss')
        .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
        .replace(/\s+/g, '_');
};

// Function to encode special characters in VCF content using Quoted-Printable encoding
export const quotedPrintableEncode = (input: string) => {
    return input
        .replace(/[^\x20-\x7E]/g, (char) => {
            // Only encode non-ASCII characters (characters outside the printable ASCII range)
            return '=' + char.charCodeAt(0).toString(16).toUpperCase();
        })
        .replace(/ /g, ' '); // Leave spaces as they are
};

/*
 * SonarQube, open source software quality management tool.
 * Copyright (C) 2008-2014 SonarSource
 * mailto:contact AT sonarsource DOT com
 *
 * SonarQube is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * SonarQube is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

package org.sonar.server.platform.monitoring;

import com.google.common.base.Predicate;
import com.google.common.collect.Iterables;
import com.google.common.collect.Lists;
import org.sonar.api.platform.PluginMetadata;
import org.sonar.api.platform.PluginRepository;

import java.util.LinkedHashMap;
import java.util.List;

/**
 * Installed plugins (excluding core plugins)
 */
public class PluginsMonitor implements Monitor {
  private final PluginRepository repository;

  public PluginsMonitor(PluginRepository repository) {
    this.repository = repository;
  }

  @Override
  public String name() {
    return "Plugins";
  }

  @Override
  public LinkedHashMap<String, Object> attributes() {
    LinkedHashMap<String, Object> attributes = new LinkedHashMap<>();
    for (PluginMetadata plugin : plugins()) {
      LinkedHashMap<String, Object> pluginAttributes = new LinkedHashMap<>();
      pluginAttributes.put("Name", plugin.getName());
      pluginAttributes.put("Version", plugin.getVersion());
      attributes.put(plugin.getKey(), pluginAttributes);
    }
    return attributes;
  }

  private List<PluginMetadata> plugins() {
    return Lists.newArrayList(Iterables.filter(repository.getMetadata(), new Predicate<PluginMetadata>() {
      @Override
      public boolean apply(PluginMetadata input) {
        return !input.isCore();
      }
    }));
  }
}
